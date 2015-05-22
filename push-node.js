/*
Name:         push-node
Description:  Send push notifications with Faast (http://faast.io)
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-push
Feedback:     https://github.com/fvdm/nodejs-push/issues
License:      Public Domain / Unlicense
              (https://github.com/fvdm/nodejs-push/raw/master/UNLICENSE)
*/

var https = require ('https');
var querystring = require ('querystring');
var app = {};


// ! Defaults
app.api = {
  credential: false
};


// ! feeds
app.feeds = function (cb) {
  talk ('GET', 'account/feeds', function (err, result) {
    if (err) { return cb (err); }
    if (result && typeof result.rss_feeds === 'object') {
      cb (null, result.rss_feeds);
    } else {
      cb (null, []);
    }
  });
};

// ! notify
app.notify = function (vars, cb) {
  var set = {};
  var i, key;
  var keys = Object.keys (vars);
  for (i = 0; i < keys.length; i++) {
    key = keys [i];
    set ['notification['+ key +']'] = vars [key];
  }
  talk ('POST', 'notifications', set, cb);
};

// ! notifications
app.notifications = function (cb) {
  talk ('GET', 'notifications', function (err, result) {
    if (!err) {
      result = result.notifications || result;
    }
    cb (err, result);
  });
};

// ! settings
app.settings = function (cb) {
  talk ('GET', 'account', function (err, result) {
    if (!err) {
      result = result.user || result;
    }
    cb (err, result);
  });
};


// ! Communication
function talk (type, path, fields, cb) {
  if (!cb && typeof fields === 'function') {
    var cb = fields;
    var fields = {};
  }

  // prevent multiple callbacks
  var complete = false;
  function doCallback (err, data) {
    if (!complete) {
      complete = true;
      cb && cb (err, data || null);
    }
  }

  // check credentials
  if (!app.api.credential) {
    return doCallback (new Error ('api.credential missing'));
  }

  // build request
  var body = null;
  fields.user_credentials = app.api.credential;
  path = '/'+ path +'.json';

  var options = {
    host: 'api.faast.io',
    port: 443,
    path: path + (type === 'GET' ? '?'+ querystring.stringify (fields) : ''),
    method: type,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'push-node.js (https://github.com/fvdm/nodejs-push)'
    }
  };

  if (type === 'POST') {
    body = querystring.stringify (fields);
    options.headers ['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers ['Content-Length'] = body.length;
  }

  var req = https.request (options);

  // response
  req.on ('response', function (response) {
    var data = '';
    var error = null;

    response.on ('close', function () {
      error = new Error ('request closed');
    });

    response.on ('data', function (chunk) {
      data += chunk;
    });

    response.on ('end', function () {
      data = data.trim ();

      try {
        data = JSON.parse (data);
      } catch (e) {
        error = new Error ('invalid response');
      }

      if (response.statusCode >= 300) {
        error = new Error ('API error');
        error.code = response.statusCode;
        error.body = data;
        error.request = options;
        error.request.path = error.request.path.replace (app.api.credential, '[secure]');
        error.requestBody = body ? body.replace (app.api.credential, '[secure]') : body;
      }

      doCallback (error, data);
    });
  });

  // error
  req.on ('error', function (err) {
    var error = new Error ('request failed');
    error.error = err;
    doCallback (err);
  });

  // done
  req.end (body);
}

// ! Setup
module.exports = function (token) {
  app.api.credential = token;
  return app;
};
