var check = require('../lib/check-auth')
var test = require('tape')
var list = ['/a']
var config = {}

config.auth = {
    whitelist: list
}

test('whitelist', function(t) {
  check(
    {req: {method: 'POST', url: '/a'}},
    {method: 'POST', route: '/a'},
    {config: config},
    function() {
      t.end()
    }, function() {
      t.ok(false)
    }
  )
})

test('checks', function(t) {
  check(
    {req: {method: 'POST', url: '/b'}},
    {method: 'POST', route: '/b'},
    {config: config},
    null,
    function() {
      t.end()
    }
  )
})

test('logs when auth fails', function(t) {
  var credentials = new Buffer('username:hunter2').toString('base64')
  var basicAuth = {authorization: 'Basic: ' + credentials}

  check(
    {req: {method: 'POST', url: '/a', headers: basicAuth}},
    {method: 'POST', route: '/a'},
    {config: {auth: {whitelist: list}, User: {auth: checkAuth}, log: {info: checkLog}}},
    function() {
      t.end()
    }
  )

  function checkAuth (username, password, ready) {
    t.equal(username, 'username')
    t.equal(password, 'hunter2')
    
    process.nextTick(function () {
      ready(null, null)
    })
  }

  function checkLog (info) {
    t.equal(info.username, 'username')
    t.true(info.message.indexOf('authorization') > -1, 'message mentions auth')

    t.end()
  }
})
