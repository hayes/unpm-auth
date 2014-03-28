module.exports = get_user

function get_user(context, route, respond) {
  var username = route.splats[0]

  context.User.find(username, function(err, user) {
    if(err) {
      return respond(err)
    }

    if(!username) {
      return respond.not_found()
    }

    respond(null, 200, user)
  })
}
