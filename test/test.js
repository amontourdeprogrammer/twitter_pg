const expect = require('chai').expect;
var { read, insert, remove } = require('../db_manager');
var { translate, condition, error } = require('../db_interface');

describe('db_manager', function() {

  before(function() {
    table = 'tweets';
    tweet = {
      'message': 'A new tweet',
      'author': 'Noobie'
    };
    selection = { 'author': 'Noobie' };
  });

  it('writes pg query to insert tweet', function() {
    expect(insert(table, tweet)).to.eq('INSERT INTO tweets (message, author, date) ' +
                                           'VALUES (\'A new tweet\', \'Noobie\', now())');
  });

  it('writes pg query to remove tweet', function() {
    expect(remove(table, selection)).to.eq('DELETE FROM tweets WHERE author = \'Noobie\'');
  });

  it('writes pg query to read all tweets', function() {
    expect(read(table, 'all')).to.eq('SELECT * FROM tweets ');
  });

  it('writes pg query to read specific tweets', function() {
    expect(read(table, selection)).to.eq('SELECT * FROM tweets WHERE author = \'Noobie\'');
  });

});

describe('db_interface', function() {

  it('extracts query elements from simple user CLI input', function() {
    var user_input = "tweets.all";
    expect(translate(user_input)).to.eql(['tweets', 'all']);
  });

  it('extracts query elements from user CLI input with filter', function() {
    var user_input = "tweets.filter_by(author: 'Elsa')";
    expect(translate(user_input)).to.eql(['tweets', { 'author': 'Elsa' }]);
  });

  it('rejects invalid user CLI input', function() {
    var valid_inputs = [ 'seya', 'tweets.all', 'tweets.filter_by(column: \'name\')' ];
    var invalid_inputs = [ 'tweets', 'tweets.blabla' ];

    expect(error(valid_inputs[0])).to.eq(null);
    expect(error(valid_inputs[1])).to.eq(null);
    expect(error(valid_inputs[2])).to.eq(null);

    expect(error(invalid_inputs[0])).to.eq('Missing filter condition for table: tweets');
    expect(error(invalid_inputs[1])).to.eq('Syntax error in filter condition for table: tweets\n' +
                                        'Expected: \'all\' or \'filter_by(column: value)\'\n' +
                                        'Received: \'blabla\'\n');
  });
});
