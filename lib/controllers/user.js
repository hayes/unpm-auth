module.exports = getUser

function getUser(respond, route, unpm) {
  var username = route.splats[0]

  unpm.User.find(username, function(err, user) {
    if(err) {
      return respond(err)
    }

    if(!username) {
      return respond.notFound()
    }

    respond(null, 200, user)
  })
}
