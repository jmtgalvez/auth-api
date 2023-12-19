const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/main.db');

// db.each("SELECT username FROM user", (err, row) => {
//     if (!row) console.log('No users.');
//     else console.log(row);
// });

module.exports = db;