var path = require('path')
  , hash = require('password-hash')
  , crypto = require('crypto')

module.exports = setup

function setup(unpm) {
  var exports = {}

  exports.find = find_user
  exports.create = create
  exports.update = update
  exports.auth = auth

  // allow the module to be adapted by an installed module in the node_modules directory
  if(unpm.config.auth && unpm.config.auth.module){
    var module_path = path.resolve(unpm.dir, 'node_modules', unpm.config.auth.module);
    exports = require(module_path)(exports, unpm)
  }
  return exports

  function find_user(username, done) {
    find(username, function(err, user) {
      if(err || !user) {
        return done(err)
      }

      done(null, clean_user(user))
    })
  }

  function find(username, done) {
    unpm.backend.getUser(username, function(err, data) {
      done(err, data || null)
    })
  }

  function auth(username, password, done) {
    find(username, function(err, user) {
      var invalid = new Error('Name or password is incorrect.')

      if(err || !user) {
        return done(invalid)
      }

      password = user.salt ? sha(password + user.salt) : password

      if(!hash.verify(password, user.password_hash)) {
        return done(invalid)
      }

      done(null, clean_user(user))
    })
  }

  function create(username, data, done) {
    if(!username || !data) {
      return done(new Error('username and data are required'))
    }

    try {
      unpm.backend.setUser(
          username
        , build_user(username, data, 1)
        , done
      )
    } catch(err) {
      done(err)
    }
  }

  function update(old, updated, done) {
    try {
      unpm.backend.setUser(
          old.name
        , build_user(updated.name, updated)
        , on_updated
      )
    } catch(err) {
      done(err)
    }

    function on_updated(err) {
      if(err) {
        return done(err)
      }

      done(null, clean_user(updated))
    }
  }

  function build_user(username, data) {
    var user = {}

    user.name = username
    user.email = data.email
    user.salt = data.salt
    user.date = data.date
    user.password_hash = hash_pass(data.password_sha || data.password)

    return user
  }

  function clean_user(raw_user) {
    var user = {}

    user.name = raw_user.name
    user.email = raw_user.email
    user.date = raw_user.date

    return user
  }

  function md5(s) {
    return crypto.createHash('md5').update(s).digest('hex')
  }

  function sha(s) {
    return crypto.createHash('sha1').update(s).digest('hex')
  }

  function hash_pass(s, settings) {
    settings = settings || unpm.config.crypto

    return hash.generate(s, settings)
  }
}
