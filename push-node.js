/*
Name:         push-node
Description:  Send push notifications with Faast (http://faast.io)
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-push
Feedback:     https://github.com/fvdm/nodejs-push/issues
License:      Public Domain / Unlicense
              (https://github.com/fvdm/nodejs-push/raw/master/UNLICENSE)
*/

var httpreq = require ('httpreq');

var config = {
  token: null,
  timeout: 5000,
  tlsVerify: true
};


/**
 * Process API response
 *
 * @callback callback
 * @param err {Error, null} - Error
 * @param res {object} - Response details
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function processResponse (err, res, callback) {
  var data = (res && res.body || '') .trim ();
  var error = null;

  if (err) {
    error = new Error ('request failed');
    error.error = err;
    callback (error);
    return;
  }

  try {
    data = JSON.parse (data);
  } catch (e) {
    error = new Error ('invalid response');
    callback (error);
    return;
  }

  if (res.statusCode >= 300) {
    error = new Error ('API error');
    error.code = res.statusCode;
    error.body = data;
    callback (error);
    return;
  }

  callback (null, data);
}


/**
 * Send a request to the API
 *
 * @callback callback
 * @param method {string} - GET or POST
 * @param path {string} - API endpoint path
 * @param [fields] {object} - Data fields to send along
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function sendRequest (method, path, fields, callback) {
  var options = {
    url: 'https://api.faast.io' + path + '.json',
    method: method,
    timeout: config.timeout,
    rejectUnauthorized: config.tlsVerify,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'push-node.js (https://github.com/fvdm/nodejs-push)'
    }
  };

  if (typeof fields === 'function') {
    callback = fields;
    fields = {};
  }

  // check credentials
  if (!config.token) {
    callback (new Error ('config.token not set'));
    return;
  }

  // build request
  fields.user_credentials = config.token;
  options.parameters = fields;

  httpreq.doRequest (options, function (err, res) {
    processResponse (err, res, callback);
  });
}


/**
 * Get list of RSS feeds in your account
 *
 * @callback callback
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function methodFeeds (callback) {
  sendRequest ('GET', '/account/feeds', function (err, data) {
    if (err) {
      callback (err);
      return;
    }

    if (data && typeof data.rss_feeds === 'object') {
      callback (null, data.rss_feeds);
      return;
    }

    callback (null, []);
  });
}


/**
 * Send a push notification
 *
 * @callback callback
 * @param params {object} - Notification parameters
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function methodNotify (params, callback) {
  var set = {};
  var key;

  for (key in params) {
    set ['notification[' + key + ']'] = params [key];
  }

  sendRequest ('POST', '/notifications', set, callback);
}


/**
 * Get list of notifications in your account
 *
 * @callback callback
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function methodNotifications (callback) {
  sendRequest ('GET', '/notifications', function (err, data) {
    if (err) {
      callback (err);
      return;
    }

    data = data.notifications || data;
    callback (null, data);
  });
}


/**
 * Get your account settings
 *
 * @callback callback
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function methodSettings (callback) {
  sendRequest ('GET', '/account', function (err, data) {
    if (err) {
      callback (err);
      return;
    }

    data = data.user || data;
    callback (null, data);
  });
}


/**
 * Configure module
 *
 * @param config.token {string} - Your API access token / credential
 * @param [config.timeout] {numbers=5000} - Request time out in ms
 * @param [config.tlsVerify] {boolean=true} - Validate remote TLS certificate
 * @returns {object} - Methods
 */

module.exports = function (token, timeout) {
  if (token instanceof Object) {
    config.token = token.token;
    config.timeout = token.timeout || 5000;
    config.tlsVerify = token.tlsVerify;
  } else {
    config.token = token;
    config.timeout = timeout || 5000;
  }

  return {
    settings: methodSettings,
    notify: methodNotify,
    notifications: methodNotifications,
    feeds: methodFeeds
  };
};
