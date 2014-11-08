/*
Name:         push-node
Description:  Send push notifications with Faast (http://faast.io)
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-push
Feedback:     https://github.com/fvdm/nodejs-push/issues
License:      Public Domain / Unlicense
              (https://github.com/fvdm/nodejs-push/raw/master/UNLICENSE)
*/

var https = require('https'),
  querystring = require('querystring')

var app = {}


// defaults
app.api = {
  credential: false
}


// Account
app.account = {

  // Subscribed feeds
  feeds: function( cb ) {
    app.talk( 'GET', 'account/feeds', cb )
  },

  // Send notification
  notify: function( vars, cb ) {
    var set = {}
    var keys = Object.keys(vars)
    for( var i=0; i < keys.length; i++ ) {
      var key = keys[i]
      set[ 'notification['+ key +']' ] = vars[ key ]
    }
    app.talk( 'POST', 'account/notifications', set, cb )
  },

  // List notifications
  notifications: function( cb ) {
    app.talk( 'GET', 'account/notifications', function( err, result ) {
      if( !err ) {
        result = result.notifications || result
      }
      cb( err, result )
    })
  },

  // Delete all notifications from the server
  destroyall: function( cb ) {
    app.talk( 'DELETE', 'account/notifications/destroy_all', cb )
  },

  // Get account settings
  settings: function( cb ) {
    app.app.talk( 'GET', 'account/notifications', function( err, result ) {
      if( !err ) {
        result = result.user || result
      }
      cb( err, result.user )
    })
  }
}


app.talk = function( type, path, fields, cb ) {
  if( !cb && typeof fields == 'function' ) {
    var cb = fields
    var fields = {}
  }

  // build path
  var path = '/'+ path +'.json'
  // prevent multiple callbacks
  var complete = false
  function doCallback( err, data ) {
    if( !complete ) {
      complete = true
      cb( err, data || null )
    }
  }

  // query string
  var body = null
  if( type == 'GET' ) {

    // GET
    if( app.api.credential ) {

      // add api key to fields
      fields.user_credentials = app.api.credential

    }

    // fields in path
    path += '?'+ querystring.stringify( fields )

  } else {

    // POST
    if( app.api.credential ) {

      // add api key to path
      path += '?user_credentials='+ app.api.credential

    }

    // fields in body
    body = querystring.stringify( fields )

  }

  // build request
  var options = {
    host:   'www.appnotifications.com',
    port:   443,
    path:   path,
    method:   type,
    headers: {
      'Accept':   'application/json',
      'User-Agent': 'push-node.js (https://github.com/fvdm/nodejs-push)'
    },
    agent:    false
  }

  // do request
  var req = https.request( options )

  // response
  req.on( 'response', function( response ) {
    var data = ''

    response.on( 'data', function( chunk ) { data += chunk })
    response.on( 'end', function() {

      // cleanup response
      data = data.replace( /(^[\r\n\s\t ]+|[\r\n\s\t ]+$)/g, '' )
      data = data.match( /^\{.*\}$/ ) ? JSON.parse( data ) : {}
      }

      if( response.statusCode >= 300 ) {
        error = new Error('API error')
        error.code = response.statusCode
        error.body = data
      }

      doCallback( error, data )
    })
  })

  // POST body
  if( body ) {
    req.write( body )
  }

  // close connection
  req.end()
}

module.exports = app