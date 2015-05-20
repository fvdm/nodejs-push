push-node
=========

Faast push notification API module for [node.js](http://nodejs.org/).

[![Circle CI](https://circleci.com/gh/fvdm/nodejs-push/tree/master.svg?style=svg)](https://circleci.com/gh/fvdm/nodejs-push/tree/master)

To use this module you need an account at [Faast](http://faast.io/)
and set the *API token* from your [account](http://api.faast.io/account/api_token).


Example
-------

Send a notification to yourself.

```js
// setup
var faast = require ('push-node') ('API token');

// notify
faast.notify (
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
);
```


Installation
------------



Stable: `npm install push-node`

Develop: `npm install fvdm/nodejs-push#develop`


Methods
-------

The methods below take a callback _function_ as last parameter.
The callback receives two parameters `err` in case of an error and `data`.

```js
function myCallback (err, data) {
  if (err) {
    console.log (err);
    console.log (err.stack);
  } else {
    console.log (data.id);
  }
}

faast.notify (props, myCallback);
```

#### Errors

message          | description                         | additional
-----------------|--------------------------------------------------
request failed   | The request cannot be made          | `err.error`
request closed   | The connection was closed too early |
invalid response | The API returned unparsable data    |
API error        | The API returned an error           | `err.code`, `err.body`, `err.request`, `err.requestBody`


settings ( callback )
--------

The user account details and settings.

```js
faast.settings (console.log);
```

#### Output

```js
{
  fb_push_command: 0,
  facebook_paid: true,
  force_twitter_client: true,
  twitter_sound: 'S',
  unlocked: true,
  weekend_silent_mode_at: '2000/01/02 23:00:00 +0000',
  facebook_sound: ''
}
```


notify ( vars, callback )
------

Send a notification to the user.

```js
faast.notify (
  {
    message: 'Alert message',
    long_message: 'The message (also in preview if <b>long_message_preview</b> is not set)',
    title: 'Subject line',
    subtitle: 'Below the subject',
    long_message_preview: 'Preview text',
    action_loc_key: 'Alert Button'
  },
  console.log
);
```

#### Output

```js
{
  title: 'Subject line',
  message_level: 0,
  long_message: 'The message (also in preview if <b>long_message_preview</b> is not set)',
  long_message_preview: 'Preview text',
  subtitle: 'Below the subject',
  send_at: '2012/07/11 19:27:00 +0000',
  id: 12345,
  favorite: false,
  hasread: false,
  message: 'Alert message',
  display_ads: false
}
```

#### Fields

name                 | description
---------------------|-----------------------------------------------------
message              | Alert message text
action_loc_key       | Alert button text
title                | Subject line
subtitle             | Below the subject
long_message         | HTML message content
                     | (also in preview if `long_message_preview` is not set)
long_message_preview | Preview text
run_command          | URL to open on `action_loc_key` button
silent               | No alert window, just increase badge number
message_level        | Importance, `-2` to `2`
sound                | Alert sound ID,
                     | see https://gist.github.com/penso/1217045
icon_url             | Notification icon URL


notifications ( callback )
-------------

Get a list (array) of notifications from the server.

```js
faast.notifications (console.log);
```

#### Output

```js
[
  {
    thread_id: null,
    title: 'Subject line',
    send_at: '2012/07/11 19:34:15 +0000',
    app_id: null,
    long_message_preview: 'Preview text',
    subtitle: 'Below the subject',
    icon_url: null,
    id: 50103867
  },
  { thread_id: null,
    title: 'Subject line',
    send_at: '2012/07/11 19:34:12 +0000',
    app_id: null,
    long_message_preview: 'Preview text',
    subtitle: 'Below the subject',
    icon_url: null,
    id: 50103866
  }
]
```


feeds ( callback )
-----

Get a list (array) of subscribed RSS feeds.

```js
faast.feeds (console.log);
```

Output:

```js
[
  {
    website: 'https://frankl.in',
    title: 'Franklin',
    feed: 'http://frankl.in/feed/',
    id: 685969,
    sound: 'R',
    updated_at: '2015/05/19 20:11:58 +0000',
    message_level: 0,
    paid: true,
    next_fetch: '2015-05-20 01:41:46 +0200',
    previous_fetch: '2015-05-20 01:23:53 +0200',
    previous_item_at: '2014/05/30 21:02:32 +0000',
    snippet: 'Interactive command for Mac Homebrew updates. Source: Franklin',
    rss_status: 'active',
    rss_feedr_id: 12345,
    last_push_received_at: null
  }
]
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


Author
------

Franklin van de Meent
| [Website](https://frankl.in)
| [Github](https://github.com/fvdm)
