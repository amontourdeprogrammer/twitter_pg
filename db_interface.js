var readline = require('readline');
var { db_connect } = require('./db_manager.js');

var rl = readline.createInterface({
  input: process.stdin,
    output: process.stdout,
    terminal: false,
    prompt: 'ipg>'
});

rl.prompt();

rl.on('line', function(user_input){
  if (error(user_input)) {
    console.log(error(user_input));
    rl.prompt();
  } else if (user_input == 'seya') {
    console.log('seya soon!');
    process.exit(0);
  } else {
    [ table_name, filter_condition ] = translate(user_input);
    db_connect(table_name, filter_condition, function() {
      rl.prompt();
    });
    console.log(filter_condition);
  }
})

function translate(user_input) { // tweets.filter_by(author: 'Elsa')
  var table_name = get_table(user_input);
  var filter = get_filter(user_input);
  var filter_condition = condition(filter);
  return [ table_name, filter_condition ]
}

function get_table(user_input) {
  return user_input.split('.')[0];
}

function get_filter(user_input) {
  return user_input.split('.')[1];
}

function valid(filter) {
  var no_filter = 'all';
  var filter_pattern = /^filter_by\((\w{1,}):\s'(.{1,})'\)$/;
  var match = filter.match(filter_pattern);
  return (filter != no_filter && !match) ? false : true;
}

function condition(filter) {
  if (filter == 'all') { return 'all'; }
  else {
    var read_pattern = /^filter_by\((\w{1,}):\s'(.{1,})'\)$/;
    var column_name = filter.replace(read_pattern, '$1');
    var value = filter.replace(read_pattern, '$2');
    var filter_condition = {};
    filter_condition[column_name] = value;
    return filter_condition;
  }
}

function error(user_input) {
  var table = get_table(user_input);
  var filter = get_filter(user_input);
  if (user_input == 'seya') { return null; }
  else if (user_input.split('.').length == 1) {
    return 'Missing filter condition for table: ' + user_input;
  } else if (!valid(filter)) {
    return 'Syntax error in filter condition for table: ' + table + '\n' +
           'Expected: \'all\' or \'filter_by(column: value)\'\n' +
           'Received: \'' + filter + '\'\n';
  } else {
    return null;
  }
}

module.exports = { translate, condition, error };
