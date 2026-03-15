const Database = require('better-sqlite3');
const db = new Database('analytics.db');

console.log('=== FULL DATA DUMP ===\n');

const tables = ['pdfs', 'viewer_sessions', 'page_events'];

tables.forEach(table => {
  console.log(`\n${table.toUpperCase()}:`);
  try {
    const allData = db.prepare(`SELECT * FROM ${table};`).all();
    console.log(JSON.stringify(allData, null, 2));
  } catch (e) {
    console.log('No data or error:', e.message);
  }
});

db.close();
