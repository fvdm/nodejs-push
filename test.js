var util = require ('util');

// Setup
// set env FAAST_TOKEN (Travis CI)
var token = process.env.FAAST_TOKEN || null;

var faast = require ('./') (token);

// handle exits
var errors = 0;
process.on ('exit', function () {
  if (errors === 0) {
    console.log ('\n\033[1mDONE, no errors.\033[0m\n');
    process.exit (0);
  } else {
    console.log ('\n\033[1mFAIL, '+ errors +' error'+ (errors > 1 ? 's' : '') +' occurred!\033[0m\n');
    process.exit (1);
  }
});

// prevent errors from killing the process
process.on ('uncaughtException', function (err) {
  console.log ();
  console.error (err.stack);
  console.trace ();
  console.log ();
  errors++;
});

// Queue to prevent flooding
var queue = [];
var next = 0;

function doNext () {
  next++;
  if (queue [next]) {
    queue [next] ();
  }
}

// doTest( passErr, 'methods', [
//   ['feeds', typeof feeds === 'object']
// ])
function doTest (err, label, tests) {
  if (err instanceof Error) {
    console.error (label +': \033[1m\033[31mERROR\033[0m\n');
    console.error (util.inspect (err, false, 10, true));
    console.log ();
    console.error (err.stack);
    console.log ();
    errors++;
  } else {
    var testErrors = [];
    tests.forEach (function (test) {
      if (test[1] !== true) {
        testErrors.push (test [0]);
        errors++;
      }
    });

    if (testErrors.length === 0) {
      console.log (label +': \033[1m\033[32mok\033[0m');
    } else {
      console.error (label +': \033[1m\033[31mfailed\033[0m ('+ testErrors.join (', ') +')');
    }
  }

  doNext ();
}

// First check API access
queue.push (function () {
  faast.settings (function (err, data) {
    if (err) {
      console.log ('API access: failed ('+ err.message +')');
      console.log ();
      console.log (err);
      console.log ();
      console.log (err.stack);
      errors++;
      process.exit (1);
    } else {
      console.log ('API access: \033[1m\033[32mok\033[0m');

      // ! settings
      doTest (err, 'settings', [
        ['type', data instanceof Object],
        ['property', typeof data.email === 'string']
      ]);

      doNext ();
    }
  });
});

// ! error
queue.push (function () {
  faast.notify ({}, function (err, data) {
    doTest (null, 'Error', [
      ['type', err instanceof Error],
      ['message', err.message === 'API error'],
      ['request', typeof err.request === 'object'],
      ['body', typeof err.requestBody === 'string' || err.requestBody === null]
    ]);
  });
});

// ! notify
queue.push (function () {
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
    doTest (err, 'notify', [
      ['type', data instanceof Object],
      ['id', typeof data.id === 'number']
    ]);
  });
});

// ! feeds
queue.push (function () {
  faast.feeds (function (err, data) {
    doTest (err, 'feeds', [
      ['type', data instanceof Array]
    ]);
  });
});

// ! notifications
queue.push (function () {
  faast.notifications (function (err, data) {
    doTest (err, 'notifications', [
      ['type', data instanceof Array]
    ]);
  });
});


// Start the tests
queue [0] ();
