nodejs-push
===========

Faast push notification API module for [node.js](http://nodejs.org/).

To use this module you need an account at [Faast](http://faast.io/)
and set the *API token* from your [account](http://api.faast.io/account/api_token).


Installation
------------

Normal install:

`npm install push-node`

Or the latest version from Github, can be unstable:

`npm install git+https://github.com/fvdm/nodejs-push`


Usage
-----

For the methods below you need to set the **api.credential**,
which can be found in your [account](http://api.faast.io/account/api_token).


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
    run_command: 'http://example.net/12345'
  },
  console.log
)
```

#### Output

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


account.settings ( callback )
----------------

The user account details and settings.

```js
apn.account.settings( console.log )
```

#### Output

```js
{ fb_push_command: 0,
  facebook_paid: true,
  force_twitter_client: true,
  twitter_sound: 'S',
  unlocked: true,
  weekend_silent_mode_at: '2000/01/02 23:00:00 +0000',
  facebook_sound: '' }
```


account.notify ( vars, callback )
--------------

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

#### Output

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

### Fields

name                 | description
-------------------- | ----------------------------------------------------
message              | Alert message text
action_loc_key       | Alert button text
title                | Subject line
subtitle             | Below the subject
long_message         | HTML message content
                     | (also in preview if long_message_preview is not set)
long_message_preview | Preview text
run_command          | URL to open on 'action_loc_key' button
silent               | No alert window, just increase badge number
message_level        | Importance, -2 to 2
sound                | Alert sound ID,
                     | see https://gist.github.com/penso/1217045
icon_url             | Notification icon URL


account.notifications ( callback )
---------------------

Get a list (array) of notifications from the server.

```js
apn.account.notifications( console.log )
```

#### Output

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


account.destroyall ( callback )
------------------

Delete all notifications from the server.
This won't touch the device(s) as they use a local cache.

```js
apn.account.destroyall( console.log )
```

#### Output

```js
{ Response: { OK: 'OK' } }
```


account.feeds ( callback )
-------------

Get a list (array) of subscribed RSS feeds.

```js
apn.account.feeds( console.log )
```


Unlicense
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
