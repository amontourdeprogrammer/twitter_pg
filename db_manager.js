var pg = require('pg');
require('dotenv').config();

var database = "pg://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@localhost:5432/" + process.env.DB_NAME;

function db_connect(table_name, filter_condition, callback) {
  pg.connect(database, function(err, client, done) {
    if(err) {
      done();
      console.log("error connecting to the database: " + err);
    }

    const query = client.query(read(table_name, filter_condition));
    query.on('row', function(row, results) {
      results.addRow(row);
    });
    query.on('end', function(results) {
      final_results = JSON.stringify(results.rows, null, "   ");
      console.log(final_results);
      callback();
      done();
    });
  });
}

function insert(table_name, tweet) {
  return 'INSERT INTO ' + table_name + ' (message, author, date) ' +
         'VALUES (' +
             '\'' + tweet['message'] + '\', ' +
             '\'' + tweet['author'] + '\', ' +
             'now()' +
          ')';
};

function read(table_name, filter_condition) {
  return 'SELECT * FROM ' + table_name + ' ' + filter_by(filter_condition);
};

function remove(table_name, filter_condition) {
  return 'DELETE FROM ' + table_name + ' ' + filter_by(filter_condition);
};

function filter_by(filter_condition) {
  if (filter_condition  == 'all') { return ''; }
  else {
    var column_name = Object.keys(filter_condition)[0];
    var value = filter_condition[column_name];
    return 'WHERE ' + column_name + ' = \'' + value + '\''; 
  }
};

module.exports = { db_connect, insert, remove, read };
