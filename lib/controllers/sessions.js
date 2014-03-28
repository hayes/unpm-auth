module.exports.create = session_request

function create_session(context, route, respond) {
    var username = context.body.username
      , password = context.body.password
      , sessions = context.sessions

    context.User.auth(username, password, function(err, user) {
      if(err || !user) {
        return respond.unauthorized()
      }

      sessions.set(user, got_session, respond)
    })
  }

  function got_session(err) {
    if(err) {
      return respond(err)
    }

    respond(null, 201, {
        'ok': true
      , 'name': username
      , 'roles': []
    })
  }
}
