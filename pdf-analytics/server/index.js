const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { nanoid } = require('nanoid');

const app = express();
const port = 3001;
const db = new Database('analytics.db');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shareToken TEXT UNIQUE NOT NULL,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS viewer_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pdfShareToken TEXT NOT NULL,
    viewerId TEXT NOT NULL,
    sessionId TEXT NOT NULL,
    firstSeen TEXT NOT NULL,
    lastSeen TEXT NOT NULL,
    lastPage INTEGER DEFAULT 1,
    totalTimeMs INTEGER DEFAULT 0
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS page_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pdfShareToken TEXT NOT NULL,
    viewerId TEXT NOT NULL,
    sessionId TEXT NOT NULL,
    page INTEGER NOT NULL,
    timeSpentMs INTEGER NOT NULL,
    scrollDepth REAL NOT NULL,
    recordedAt TEXT NOT NULL
  );
`);

// Add unique index to prevent constraint violations
db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_unique ON viewer_sessions(pdfShareToken, viewerId, sessionId);`);

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const newFilename = `${Date.now()}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

app.post('/api/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const shareToken = nanoid(10);
  const { filename, originalname } = req.file;
  const createdAt = new Date().toISOString();

  const stmt = db.prepare('INSERT INTO pdfs (shareToken, filename, originalName, createdAt) VALUES (?, ?, ?, ?)');
  stmt.run(shareToken, filename, originalname, createdAt);

  res.json({
    shareToken,
    viewerUrl: `/view/${shareToken}`,
    dashboardUrl: `/dashboard/${shareToken}`,
  });
});

app.post('/api/track', (req, res) => {
  try {
    const { shareToken, viewerId, events, sessionId: clientSessionId } = req.body;
    const now = new Date().toISOString();
    const effectiveSessionId = clientSessionId || nanoid();

    // Upsert session (handles first time + updates)
    const upsertStmt = db.prepare(`INSERT OR REPLACE INTO viewer_sessions 
      (pdfShareToken, viewerId, sessionId, firstSeen, lastSeen, lastPage, totalTimeMs) 
      VALUES (?, ?, ?, COALESCE((SELECT firstSeen FROM viewer_sessions WHERE pdfShareToken=? AND viewerId=?), ?), ?, 1, 0)`);
    upsertStmt.run(shareToken, viewerId, effectiveSessionId, shareToken, viewerId, now, now);

    // Insert page events
    const eventStmt = db.prepare('INSERT INTO page_events (pdfShareToken, viewerId, sessionId, page, timeSpentMs, scrollDepth, recordedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
    let totalTimeMs = 0;
    let maxPage = 1;
    for (const event of events) {
      eventStmt.run(shareToken, viewerId, effectiveSessionId, event.page, event.timeSpentMs, event.scrollDepth, now);
      totalTimeMs += event.timeSpentMs;
      if (event.page > maxPage) {
        maxPage = event.page;
      }
    }

    // Update session totals (by pdf+viewer, idempotent)
    const totalsStmt = db.prepare('UPDATE viewer_sessions SET totalTimeMs = totalTimeMs + ?, lastPage = GREATEST(lastPage, ?), lastSeen=? WHERE pdfShareToken = ? AND viewerId = ?');
    totalsStmt.run(totalTimeMs, maxPage, now, shareToken, viewerId);

    res.json({ ok: true });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ error: 'Track failed' });
  }
});

app.get('/api/analytics/:shareToken', (req, res) => {
  const { shareToken } = req.params;

  const pdf = db.prepare('SELECT * FROM pdfs WHERE shareToken = ?').get(shareToken);
  if (!pdf) {
    return res.status(404).json({ error: 'PDF not found.' });
  }

  const totalViewers = db.prepare('SELECT COUNT(DISTINCT viewerId) as count FROM viewer_sessions WHERE pdfShareToken = ?').get(shareToken).count || 0;

  const avgReadingTime = db.prepare('SELECT AVG(totalTimeMs) as avg FROM viewer_sessions WHERE pdfShareToken = ?').get(shareToken).avg || 0;

  const pageStatsStmt = db.prepare(`
    SELECT page, AVG(timeSpentMs) as avgTimeMs, COUNT(DISTINCT viewerId) as viewerCount
    FROM page_events
    WHERE pdfShareToken = ?
    GROUP BY page
    ORDER BY page ASC
  `);
  const pageStatsRaw = pageStatsStmt.all(shareToken);
  const pageStats = pageStatsRaw.map(row => ({
    page: row.page,
    avgTimeSeconds: row.avgTimeMs / 1000,
    viewerCount: row.viewerCount,
    dropoffPercent: totalViewers > 0 ? ((totalViewers - row.viewerCount) / totalViewers) * 100 : 0
  }));

  const totalPages = pageStatsRaw.length;

  const viewersReachedLastPage = totalPages > 0 ? db.prepare('SELECT COUNT(DISTINCT viewerId) as count FROM viewer_sessions WHERE pdfShareToken = ? AND lastPage >= ?').get(shareToken, totalPages)?.count : 0;
  const completionRate = totalViewers > 0 ? (viewersReachedLastPage / totalViewers) * 100 : 0;

  const viewersStmt = db.prepare(`
    SELECT 
      vs.viewerId, 
      vs.firstSeen, 
      vs.lastSeen, 
      vs.totalTimeMs, 
      vs.lastPage,
      GROUP_CONCAT(DISTINCT pe.page) as pagesViewed
    FROM viewer_sessions vs
    LEFT JOIN page_events pe ON vs.viewerId = pe.viewerId AND vs.pdfShareToken = pe.pdfShareToken
    WHERE vs.pdfShareToken = ? 
    GROUP BY vs.viewerId
  `);
  const viewers = viewersStmt.all(shareToken).map(v => ({
    ...v,
    pagesViewed: v.pagesViewed ? v.pagesViewed.split(',').map(Number).sort((a,b) => a-b) : [],
    totalTimeSeconds: v.totalTimeMs / 1000
  }));

  res.json({
    totalViewers,
    avgReadingTimeSeconds: avgReadingTime / 1000,
    completionRate,
    pageStats,
    viewers,
    totalPages,
    pdfName: pdf.originalName
  });
});

app.get('/api/pdf/:shareToken', (req, res) => {
  const { shareToken } = req.params;
  const pdf = db.prepare('SELECT * FROM pdfs WHERE shareToken = ?').get(shareToken);
  if (!pdf) {
    return res.status(404).json({ error: 'PDF not found.' });
  }

  const filePath = path.join(uploadsDir, pdf.filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ error: 'File not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
