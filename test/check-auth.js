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
  t.plan(5)

  var credentials = new Buffer('username:hunter2').toString('base64')
  var basicAuth = {authorization: 'Basic: ' + credentials}
  var fakeResponse = {writeHead: checkHead, end: noop}

  check(
    {req: {method: 'POST', url: '/b', headers: basicAuth}, res: fakeResponse},
    {method: 'POST', route: '/b'},
    {User: {auth: checkAuth}, config: {auth: {whitelist: list}}, log: {info: checkLog}},
    noop
  )

  function checkHead (code) {
    t.equal(code, 403)
  }

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
  }
})

function noop () {
  // no-op
}
