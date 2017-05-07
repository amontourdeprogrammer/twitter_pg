const expect = require('chai').expect;
var { read, insert, remove } = require('../db_manager');

describe('db_manager', function() {

  before(function() {
    tweet = {
      'message': 'A new tweet',
      'author': 'Noobie'
    };
    selection = { 'author': 'Noobie' };
  });

  it('writes pg query to insert tweet', function() {
    expect(insert('tweets', tweet)).to.eq('INSERT INTO tweets (message, author, date) ' +
                                           'VALUES (\'A new tweet\', \'Noobie\', now())');
  });

  it('writes pg query to remove tweet', function() {
    expect(remove('tweets', selection)).to.eq('DELETE FROM tweets WHERE author = \'Noobie\'');
  });

  it('writes pg query to read all tweets', function() {
    expect(read('tweets', 'all')).to.eq('SELECT * FROM tweets ');
  });

  it('writes pg query to read specific tweets', function() {
    expect(read('tweets', selection)).to.eq('SELECT * FROM tweets WHERE author = \'Noobie\'');
  });

});
