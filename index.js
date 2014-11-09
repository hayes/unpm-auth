var controllers = require('./lib/controllers')
var checkAuth = require('./lib/check-auth')
var concat = require('concat-stream')
var User = require('./lib/user')

module.exports = setup
module.exports.checkAuth = checkAuth

function setup(unpm, userModel) {
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

  unpm.User = userModel || User(unpm)

  if(unpm.config.checkAuth) {
    unpm.middleware.push(checkAuth)
  }

  function load(handler) {
    return function(respond, route, unpm) {
      var stream = concat(loaded)

      stream.on('error', respond)
      respond.req.pipe(stream)

      function loaded(data) {
        try {
          handler(respond, route, JSON.parse(data.toString()), unpm)
        } catch(err) {
          respond(err)
        }
      }
    }
  }
}
