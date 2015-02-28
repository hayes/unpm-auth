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
