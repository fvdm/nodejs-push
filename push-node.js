/*
Name:         push-node
Description:  Send push notifications with Faast (http://faast.io)
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-push
Feedback:     https://github.com/fvdm/nodejs-push/issues
License:      Public Domain / Unlicense
              (https://github.com/fvdm/nodejs-push/raw/master/UNLICENSE)
*/

var https = require('https')
var querystring = require('querystring')

var app = {}


// defaults
app.api = {
  credential: false
}


// Account
app.account = {

  // ! account.feeds
  feeds: function( cb ) {
    app.talk( 'GET', 'account/feeds', cb )
  },

  // ! account.notify
  notify: function( vars, cb ) {
    var set = {}
    var keys = Object.keys(vars)
    for( var i=0; i < keys.length; i++ ) {
      var key = keys[i]
      set[ 'notification['+ key +']' ] = vars[ key ]
    }
    app.talk( 'POST', 'account/notifications', set, cb )
  },

  // ! account.notifications
  notifications: function( cb ) {
    app.talk( 'GET', 'account/notifications', function( err, result ) {
      if( !err ) {
        result = result.notifications || result
      }
      cb( err, result )
    })
  },

  // ! account.destroyall
  destroyall: function( cb ) {
    app.talk( 'DELETE', 'account/notifications/destroy_all', cb )
  },

  // ! account.settings
  settings: function( cb ) {
    app.app.talk( 'GET', 'account/notifications', function( err, result ) {
      if( !err ) {
        result = result.user || result
      }
      cb( err, result.user )
    })
  }
}


// ! Communication
app.talk = function( type, path, fields, cb ) {
  if( !cb && typeof fields === 'function' ) {
    var cb = fields
    var fields = {}
  }

  // prevent multiple callbacks
  var complete = false
  function doCallback( err, data ) {
    if( !complete ) {
      complete = true
      cb( err, data || null )
    }
  }

  // build request
  var query = querystring.stringify( fields )
  var path = '/'+ path +'.json'
  var body = null

  if( type == 'GET' ) {
    if( app.api.credential ) {
      fields.user_credentials = app.api.credential
    }
    path += '?'+ query
  } else {
    if( app.api.credential ) {
      path += '?user_credentials='+ app.api.credential
    }
    body = query
  }

  var options = {
    host: 'www.appnotifications.com',
    port: 443,
    path: path,
    method: type,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'push-node.js (https://github.com/fvdm/nodejs-push)'
    }
  }

  var req = https.request( options )

  // response
  req.on( 'response', function( response ) {
    var data = ''
    var error = null

    response.on( 'close', function() { error = new Error('request closed') })
    response.on( 'data', function( chunk ) { data += chunk })
    response.on( 'end', function() {
      data = data.trim()

      try {
        data = JSON.parse( data )
      } catch(e) {
        error = new Error('invalid response')
      }

      if( response.statusCode >= 300 ) {
        error = new Error('API error')
        error.code = response.statusCode
        error.body = data
      }

      doCallback( error, data )
    })
  })

  // error
  req.on( 'error', function( err ) {
    var error = new Error('request failed')
    error.error = err
    doCallback( err )
  })

  // done
  req.end( body )
}

// ! Setup
module.exports = function( token ) {
  app.api.credential = token
  return app
}
