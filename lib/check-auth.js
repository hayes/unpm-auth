module.exports = check

var whitelist = ['/_session', '/-/user/org.couchdb.user:*']

function check(context, done) {
  var route = context.route.route

  if(context.route.method === 'GET' || whitelist.indexOf(route) !== -1) {
    return done()
  }

  auth(context, done)
}

function auth(context, done) {
  var auth_header = context.req.headers.authorization

  if(!auth_header) {
    return unauthorized()
  }

  auth_header = new Buffer(
      context.req.headers.authorization.split(' ')[1]
    , 'base64'
  ).toString().split(':')

  context.User.auth(auth_header[0], auth_header[1], got_user)

  function got_user(err, user) {
    if(err || !user) {
      return unauthorized()
    }

    done()
  }

  function unauthorized() {
    context.res.writeHead(403)
    context.res.end('{"error":"forbidden"}')
  }
}
