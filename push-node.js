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
  EventEmitter = require('events').EventEmitter,
  querystring = require('querystring')

var app = new EventEmitter


// defaults
app.api = {
  credential: false
}


// Account
app.account = {

  // Subscribed feeds
  feeds: function( cb ) {
    app.talk( 'GET', 'account/feeds', function( result ) {
      cb( result )
    })
  },

  // Send notification
  notify: function( vars, cb ) {
    var set = {}
    for( var key in vars ) {
      set[ 'notification['+ key +']' ] = vars[ key ]
    }
    app.talk( 'POST', 'account/notifications', set, function( result ) {
      cb( result )
    })
  },

  // List notifications
  notifications: function( cb ) {
    app.talk( 'GET', 'account/notifications', function( result ) {
      cb( result.notifications )
    })
  },

  // Delete all notifications from the server
  destroyall: function( cb ) {
    app.talk( 'DELETE', 'account/notifications/destroy_all', function( result ) {
      cb( result )
    })
  },

  // Get account settings
  settings: function( cb ) {
    app.talk( 'GET', 'account/notifications', function( result, head ) {
      cb( result.user )
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
  var req = https.request( options, function( response ) {

    // response
    response.setEncoding('utf8')
    var data = ''

    response.on( 'data', function( chunk ) { data += chunk })
    response.on( 'end', function() {

      // cleanup response
      data = data.replace( /(^[\r\n\s\t ]+|[\r\n\s\t ]+$)/g, '' )
      data = data.match( /^\{.*\}$/ ) ? JSON.parse( data ) : {}

      // emit trouble
      if( response.headers.status >= 300 ) {
        app.emit( 'api-error', {
          request:    options,
          request_body: body,
          response: {
            headers:  response.headers,
            body:   data
          }
        })
      }

      // do callback
      cb( data, response.headers )

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