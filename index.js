var pg = require('pg');
require('dotenv').config();

var database = "pg://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@localhost:5432/" + process.env.DB_NAME;

var client = new pg.Client(database);
client.connect();

var query = client.query("SELECT * FROM tweets ORDER BY date");
query.on("row", function(row, result) {
  result.addRow(row);
});
query.on("end", function(result) {
  console.log(JSON.stringify(result.rows, null, "  "));
  client.end();
});
