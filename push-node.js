/*
push-node.js
Source: https://github.com/fvdm/nodejs-push

UNLICENSE
---------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
*/

var	https = require('https'),
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
		host:		'www.appnotifications.com',
		port:		443,
		path:		path,
		method:		type,
		headers: {
			'Accept':		'application/json',
			'User-Agent':	'push-node.js (https://github.com/fvdm/nodejs-push)'
		},
		agent:		false
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
					request:		options,
					request_body:	body,
					response: {
						headers:	response.headers,
						body:		data
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