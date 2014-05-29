// imports
var express = require('express');
var logfmt = require('logfmt');
var htmlminify = require('html-minifier').minify;
var textBody = require('body');
var compress = require('compression');
var cleanCSS = require('clean-css');
var uglifyjs = require('uglify-js2');


// globals
var app = express();
var defaultPort = 3000;
var htmlminifyOpts = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  removeCDATASectionsFromCDATA: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeEmptyElements: true,
  caseSensitive: true,
  minifyJS: true,
  minifyCSS: true,
};
var cssminifyOpts = {
  keepSpecialComments: false,
  keepBreaks: false,
  benchmark: false,
  noRebase: false,
  processImport: false,
  noAdvanced: false,
  compatibility: false,
  debug: false,
};
var uglifyOpts = {
  fromString: true,
  mangle: true,
};


// config
app.use(compress());
app.use(logfmt.requestLogger());


// routes
app.post('/html', shrinkHTML);
app.post('/css', shrinkCSS);
app.post('/js', shrinkJS);


// views
function shrinkHTML(req, res) {
   res.contentType('text/html');

  // Grab the body of the POST request as text.
  textBody(req, function(err, body) {
    res.send(htmlminify(body, htmlminifyOpts));
  });
}


function shrinkCSS(req, res) {
   res.contentType('text/css');

  // Grab the body of the POST request as text.
  textBody(req, function(err, body) {
    res.send(new cleanCSS(cssminifyOpts).minify(body));
  });
}


function shrinkJS(req, res) {
   res.contentType('text/javascript');

  // Grab the body of the POST request as text.
  textBody(req, function(err, body) {
    res.send(uglifyjs.minify(body, uglifyOpts)['code']);
  });
}


// run
var server = app.listen(process.env.PORT || defaultPort, function() {
  console.log('Listening on port %d.', server.address().port);
});
