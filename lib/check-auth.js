module.exports = check

function check(context, done) {
  var config = context.config.auth
    , whitelist = config.whitelist
    , route = context.route

  if(!config.authenticated_gets && route.method === 'GET') {
    return done()
  }

  if(!whitelist.indexOf(route.route) === -1) {
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
