var check = require('../lib/check-auth')
var test = require('tape')
var list = ['/a']
var config = {}

config.auth = {
    whitelist: list
}

test('whitelist', function(t) {
  check(
    null,
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
    null,
    {method: 'POST', route: '/b'},
    {config: config},
    null,
    function() {
      t.end()
    }
  )
})
