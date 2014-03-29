var SessionStore = require('./lib/SessionStore')
  , controllers = require('./lib/controllers')
  , concat = require('concat-stream')
  , User = require('./lib/User')

module.exports = setup

function setup(unpm, store) {
  unpm.router.add(
      'GET'
    , '/-/user/org.couchdb.user:*'
    , load(controllers.user)
  )
  unpm.router.add(
      'PUT'
    , '/-/user/org.couchdb.user:*'
    , load(controllers.register)
  )
  unpm.router.add(
      'PUT'
    , '/-/user/org.couchdb.user:*/*'
    , load(controllers.update)
  )
  unpm.router.add(
      'POST'
    , '/_session'
    , load(controllers.create)
  )
  unpm.sessions = store || SessionStore()
  unpm.User = User(unpm)

  function load(handler) {
    return function(context, route, respond) {
      var stream = concat(loaded)

      stream.on('error', respond)
      context.req.pipe(stream)
    }

    function loaded(data) {
      try {
        data = JSON.parse(data.toString())
        context.body = data
        handler(context, route, respond)
      } catch(err) {
        respond(err)
      }
    }
  }
}
