module.exports = register

function register(context, route, respond) {
  var username = route.splats[0]

  context.User.find(username, function(err, user) {
    if(user) {
      return respond.conflict()
    }

    context.User.create(username, context.body, created, respond)
  })

  function created(err) {
    if(err) {
      return respond(err)
    }

    respond(null, 201, context.body)
  }
}
