module.exports = register

function register(respond, route, body, unpm) {
  var username = route.splats[0]

  unpm.User.find(username, function(err, user) {
    if(user) {
      return respond.conflict()
    }

    unpm.User.create(username, body, created, respond)
  })

  function created(err) {
    if(err) {
      return respond(err)
    }

    respond(null, 201, body)
  }
}
