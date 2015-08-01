// A simple Node server for your HTML files
// Prevents cross-origin problems in Chrome when doing local testing
// To execute: $ node server

var connect = require('connect');
var serveStatic = require('serve-static');

// Allow for custom ports
if (process.argv[2] === undefined) {
    var port = 9000;
} else {
    var port = process.argv[2];
}

connect().use(serveStatic(__dirname)).listen(port);
console.log('Server running at localhost:' + port);
console.log('Press CTRL + C to terminate...');