module.exports = check

var authRoutes = [
  '/_session',
  '/-/user/org.couchdb.user:*',
  '/-/user/org.couchdb.user:*/*/*'
]

function check(respond, route, unpm, done, _auth) {
  var config = unpm.config.auth
  var whitelist = config.whitelist || authRoutes
  var gets = config.authenticatedGets || config.authenticated_gets

  if(!gets && respond.req.method.toUpperCase() === 'GET') {
    return done()
  }

  if(route && whitelist.indexOf(route.route) !== -1) {
    return done()
  }

  (_auth || auth)(respond, route, unpm, done)
}

function auth(respond, route, unpm, done) {
  var authHeader = respond.req.headers.authorization

  if(!authHeader) {
    return unauthorized()
  }

  authHeader = new Buffer(
    respond.req.headers.authorization.split(' ')[1],
    'base64'
  ).toString().split(':')

  unpm.User.auth(authHeader[0], authHeader[1], gotUser)

  function gotUser(err, user) {
    if(err || !user) {
      return unauthorized()
    }

    done()
  }

  function unauthorized() {
    respond.res.writeHead(403)
    respond.res.end('{"error":"forbidden"}')
  }
}
