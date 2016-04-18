/*
Name:         push-node - test script
Description:  Send push notifications with Faast (http://faast.io)
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-push
Feedback:     https://github.com/fvdm/nodejs-push/issues
License:      Public Domain / Unlicense
              (https://github.com/fvdm/nodejs-push/raw/master/UNLICENSE)
*/

var dotest = require ('dotest');
var app = require ('./');


// Setup
// set env FAAST_TOKEN (Travis CI)
var token = process.env.FAAST_TOKEN || null;
var timeout = process.env.FAAST_TIMEOUT || 5000;

var faast = app (token);


// Module
dotest.add ('Module', function (test) {
  test ()
    .isFunction ('fail', 'exports', app)
    .isObject ('fail', 'interface', faast)
    .isFunction ('fail', '.settings', faast && faast.settings)
    .isFunction ('fail', '.notify', faast && faast.notify)
    .isFunction ('fail', '.notifications', faast && faast.notifications)
    .isFunction ('fail', '.feeds', faast && faast.feeds)
    .done ();
});

// API access
dotest.add ('API access', function (test) {
  if (!token) {
    dotest.log ('fail', 'FAAST_TOKEN not set');
    dotest.exit ();
  } else {
    test ()
      .good ('FAAST_TOKEN is set')
      .done ();
  }
});

// error
dotest.add ('API error', function (test) {
  faast.notify ({}, function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'API error')
      .isObject ('fail', 'err.request', err && err.request)
      .isString ('fail', 'err.requestBody', err && err.requestBody)
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});

// settings
dotest.add ('Method .settings', function (test) {
  faast.settings (function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isString ('fail', 'data.email', data && data.email)
      .done ();
  });
});

// notify
dotest.add ('Method .notify', function (test) {
  var note = {
    message: 'npm test notify',
    long_message: 'Looks alright so far',
    title: 'npm test',
    subtitle: 'Looking good',
    long_message_preview: new Date () .toJSON (),
    action_loc_key: 'Code',
    run_command: 'https://github.com/fvdm/nodejs-push'
  };

  faast.notify (note, function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isNumber ('fail', 'data.id', data && data.id)
      .done ();
  });
});

// feeds
dotest.add ('Method .feeds', function (test) {
  faast.feeds (function (err, data) {
    test (err)
      .isArray ('fail', 'data', data)
      .done ();
  });
});

// notifications
dotest.add ('Method .notifications', function (test) {
  faast.notifications (function (err, data) {
    test (err)
      .isArray ('fail', 'data', data)
      .done ();
  });
});


// Start the tests
dotest.run ();
