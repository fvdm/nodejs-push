# nodejs-push

Push4 / App Notifications API module for [Node.js](http://nodejs.org/).

To use this module you need an account at [AppNotifications.com](http://www.appnotifications.com/). To access your account details and push to yourself you need the *API credential* code which you find in your [account settings](http://www.appnotifications.com/account/edit).

## This is BETA software

Described methods and their callbacks may change until v1.0.0 is released.

## Installation

Either get and load the code from Github:

```sh
git clone https://github.com/fvdm/nodejs-push.git
```

```js
var apn = require('./nodejs-push')
```

Or install via [NPM](http://search.npmjs.org/) and load the code from wherever your modules are installed:

```sh
npm install push-node
```

```js
var apn = require('push-node')
```

## Usage

For now, while still beta, you can only access methods for your own account. For example, sending notifications to yourself or retrieving the list of notifications. To do this you need to set the **api.credential** setting, which can be found in your [account settings](http://www.appnotifications.com/account/edit).

### Example

Send a notification to yourself.

```js
var apn = require('push-node')

// authenticate
apn.api.credential = 'my API secret'

// notify
apn.account.notify(
	{
		message: 'Alert message',
		action_loc_key: 'Alert Button'
		title: 'Subject line',
		subtitle: 'Below the subject',
		long_message: 'The message (also in preview if <b>long_message_preview</b> is not set)',
		long_message_preview: 'Preview text',
	},
	console.log
)
```

Output:

```js
{ title: 'Subject line',
  message_level: 0,
  long_message: 'The message (also in preview if <b>long_message_preview</b> is not set)',
  long_message_preview: 'Preview text',
  subtitle: 'Below the subject',
  send_at: '2012/07/11 19:07:32 +0000',
  id: 12344,
  favorite: false,
  hasread: false,
  message: 'Alert message',
  display_ads: false }
```

## Account

Access methods for a user.

## account.settings
### ( callback )

The user account details and settings.

```js
apn.account.settings( console.log )
```
```js
{ fb_push_command: 0,
  facebook_paid: true,
  force_twitter_client: true,
  twitter_sound: 'S',
  unlocked: true,
  weekend_silent_mode_at: '2000/01/02 23:00:00 +0000',
  facebook_sound: '' }
```

## account.notify
### ( vars, callback )

Send a notification to the user.

```js
apn.account.notify(
	{
		message: 'Alert message',
		long_message: 'The message (also in preview if <b>long_message_preview</b> is not set)',
		title: 'Subject line',
		subtitle: 'Below the subject',
		long_message_preview: 'Preview text',
		action_loc_key: 'Alert Button'
	},
	console.log
)
```
```js
{ title: 'Subject line',
  message_level: 0,
  long_message: 'The message (also in preview if <b>long_message_preview</b> is not set)',
  long_message_preview: 'Preview text',
  subtitle: 'Below the subject',
  send_at: '2012/07/11 19:27:00 +0000',
  id: 12345,
  favorite: false,
  hasread: false,
  message: 'Alert message',
  display_ads: false }
```

## account.notifications
### ( callback )

Get a list (array) of notifications from the server.

```js
apn.account.notifications( console.log )
```
```js
[ { thread_id: null,
    title: 'Subject line',
    send_at: '2012/07/11 19:34:15 +0000',
    app_id: null,
    long_message_preview: 'Preview text',
    subtitle: 'Below the subject',
    icon_url: null,
    id: 50103867 },
  { thread_id: null,
    title: 'Subject line',
    send_at: '2012/07/11 19:34:12 +0000',
    app_id: null,
    long_message_preview: 'Preview text',
    subtitle: 'Below the subject',
    icon_url: null,
    id: 50103866 } ]
```

## account.feeds
### ( callback )

Get a list (array) of subscribed RSS feeds.

```js
apn.account.feeds( console.log )
```

## Events

The module emits some events to catch trouble away from the methods. Useful for debugging, logging, API outages, etc.

## api-error
### ( reasonObject )

Every time an API call returns a HTTP status code >= 300 this event is triggered. The **reasonObject** contains details about the request and response.

```js
apn.on( 'api-error', function( reason ) {
	console.log( 'API error:' )
	console.log( reason )
})
```


## Unlicense

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