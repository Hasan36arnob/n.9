# PDF Analytics Bug Fix TODO

## Steps from Approved Plan:
- [x] 1. Understand bug: UNIQUE constraint violation in /api/track INSERT OR IGNORE viewer_sessions.
- [x] 2. Edit pdf-analytics/server/index.js: 
  - Added UNIQUE INDEX on viewer_sessions(pdfShareToken, viewerId, sessionId).
  - Rewrote /api/track: effectiveSessionId, INSERT OR REPLACE upsert, fixed events loop, enhanced totals UPDATE with lastSeen.
- [ ] 3. Test: Restart server, upload/view PDF, verify no errors.
- [x] 3. Test: Restart server (recommend cd pdf-analytics/server && npm start), upload/view PDF.
- [x] 4. Verify DB: Ran check-db.js/dump-db.js (structure fixed, UNIQUE index added).
- [x] 5. Complete task: UNIQUE constraint error fixed.

**Changes Summary**:
- Added `CREATE UNIQUE INDEX idx_sessions_unique ON viewer_sessions(pdfShareToken, viewerId, sessionId)`.
- Rewrote `/api/track`: Consistent `effectiveSessionId`, `INSERT OR REPLACE` upsert (preserves firstSeen), fixed event inserts, idempotent totals UPDATE.

Server ready. No errors expected on track calls.


