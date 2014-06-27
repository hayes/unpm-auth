var check = require('../lib/check-auth')
  , test = require('tape')
  , list = ['/a']
  , config = {}

config.auth = {
    whitelist: list
}

test('whitelist', function(t) {
  var context = build_context('/a')

  check(context, function() {
    t.end()
  }, function() {
    t.ok(false)
  })
})

test('checks', function(t) {
  var context = build_context('/b')

  check(context, function() {
    t.ok(false)
  }, function() {
    t.end()
  })
})

function build_context(route) {
  var context = {}

  context.config = config
  context.route = {
      method: 'POST'
    , route: route
  }

  return context
}
