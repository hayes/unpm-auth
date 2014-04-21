module.exports.create = create_session

function create_session(context, route, respond) {
  var username = context.body.username
    , password = context.body.password
    , sessions = context.sessions
    , res = context.res

  context.User.auth(username, password, function(err, user) {
    if(err || !user) {
      return respond.unauthorized()
    }

    sessions.set(user, got_session)
  })

  function got_session(err, token) {
    if(err) {
      return respond(err)
    }

    res.writeHead(200, {
        'Content-Type': 'application/json'
      , 'Set-Cookie': 'AuthSession=' + token
    })
    res.end(JSON.stringify({
        'ok': true
      , 'name': username
      , 'roles': []
    }))
  }
}
