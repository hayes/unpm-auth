module.exports = update

function update(context, route, respond) {
  var username = route.splats[0]

  var pass = new Buffer(
      context.req.headers.authorization.split(' ')[1]
    , 'base64'
  ).toString().split(':')[1]

  context.User.auth(username, pass, got_user)

  function got_user(err, user) {
    if(err || !user) {
      return respond.unauthorized()
    }

    context.User.update(user, context.body, updated)
  }

  function updated(err, user) {
    if(err || !user) {
      return respond(err)
    }

    respond(null, 201, user)
  }
}
