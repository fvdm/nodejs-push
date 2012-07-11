var	https = require('https'),
	EventEmitter = require('events').EventEmitter,
	querystring = require('querystring')

var app = new EventEmitter

app.api = {
	credential: false
}


app.account = {
	feeds: function( cb ) {
		app.talk( 'GET', 'account/feeds', function( result ) {
			cb( result )
		})
	},
	
	notify: function( vars, cb ) {
		var set = {}
		for( var key in vars ) {
			set[ 'notification['+ key +']' ] = vars[ key ]
		}
		app.talk( 'POST', 'account/notifications', set, function( result ) {
			cb( result )
		})
	},
	
	notifications: function( cb ) {
		app.talk( 'GET', 'account/notifications', function( result ) {
			cb( result.notifications )
		})
	},
	
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
	var body = false
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
	
	var options = {
		host:		'www.appnotifications.com',
		port:		443,
		path:		path,
		method:		type,
		headers: {
			'Accept':		'application/json',
			'User-Agent':	'4push.js (https://github.com/fvdm/nodejs-4push)'
		},
		agent:		false
	}
	
	var req = https.request( options, function( response ) {
		response.setEncoding('utf8')
		var data = ''
		response.on( 'data', function( chunk ) { data += chunk })
		response.on( 'end', function() {
			
			data = data.replace( /(^[\r\n\s\t ]+|[\r\n\s\t ]+$)/g, '' )
			data = data.match( /^\{.*\}$/ ) ? JSON.parse( data ) : {}
			cb( data, response.headers )
			
		})
	})
	
	if( body ) {
		req.write( body )
	}
	
	req.end()
}

module.exports = app