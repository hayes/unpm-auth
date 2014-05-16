var SessionStore = require('./lib/session-store')
  , controllers = require('./lib/controllers')
  , check_auth = require('./lib/check-auth')
  , concat = require('concat-stream')
  , User = require('./lib/user')

module.exports = setup
module.exports.check_auth = check_auth

function setup(unpm, store) {
  unpm.router.add(
      'GET'
    , '/-/user/org.couchdb.user:*'
    , controllers.user
  )
  unpm.router.add(
      'PUT'
    , '/-/user/org.couchdb.user:*/*/*'
    , load(controllers.update)
  )
  unpm.router.add(
      'PUT'
    , '/-/user/org.couchdb.user:*'
    , load(controllers.register)
  )
  unpm.router.add(
      'POST'
    , '/_session'
    , load(controllers.create)
  )
  unpm.sessions = store || SessionStore()
  unpm.User = unpm.config.User ? unpm.config.User(unpm) : User(unpm)

  function load(handler) {
    return function(context, route, respond) {
      var stream = concat(loaded)

      stream.on('error', respond)
      context.req.pipe(stream)

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
}
