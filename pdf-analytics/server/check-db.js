const Database = require('better-sqlite3');
const db = new Database('analytics.db');

console.log('=== TABLES ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
tables.forEach(table => console.log(table.name));

console.log('\n=== SCHEMA ===');
tables.forEach(({name}) => {
  const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?;`).get(name);
  console.log(`\n${name}:`);
  console.log(schema.sql);
});

const tableNames = tables.map(t => t.name);

['pdfs', 'viewer_sessions', 'page_events'].forEach(table => {
  if (tableNames.includes(table)) {
    console.log(`\n=== COUNT ${table.toUpperCase()} ===`);
    const count = db.prepare(`SELECT COUNT(*) as cnt FROM ${table};`).get();
    console.log(`Count: ${count.cnt}`);
    
    console.log(`\n=== SAMPLE DATA ${table.toUpperCase()} (LIMIT 3) ===`);
    const samples = db.prepare(`SELECT * FROM ${table} LIMIT 3;`).all();
    console.log(JSON.stringify(samples, null, 2));
  }
});

db.close();
console.log('\nDatabase check complete.');
