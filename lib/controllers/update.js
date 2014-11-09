module.exports = update

function update(respond, route, body, unpm) {
  var username = route.splats[0]

  var pass = new Buffer(
    respond.req.headers.authorization.split(' ')[1],
    'base64'
  ).toString().split(':')[1]

  unpm.User.auth(username, pass, got_user)

  function got_user(err, user) {
    if(err || !user) {
      return respond.unauthorized()
    }

    unpm.User.update(user, body, updated)
  }

  function updated(err, user) {
    if(err || !user) {
      return respond(err)
    }

    respond(null, 201, user)
  }
}
