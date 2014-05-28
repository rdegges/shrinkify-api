// imports
var express = require('express');
var logfmt = require('logfmt');
var htmlminify = require('html-minifier').minify;
var textBody = require('body');
var compress = require('compression');
var cleanCSS = require('clean-css');


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


// config
app.use(compress());
app.use(logfmt.requestLogger());


// routes
app.post('/html', shrinkHTML);
app.post('/css', shrinkCSS);


// views
function shrinkHTML(req, res) {

  // Grab the body of the POST request as text.
  textBody(req, function(err, body) {

    // Now we'll compress the HTML / CSS / JS and return it!
    res.send(htmlminify(body, htmlminifyOpts));
  });

}


function shrinkCSS(req, res) {

  // Grab the body of the POST request as text.
  textBody(req, function(err, body) {

    // Now we'll compress the CSS and return it!
    res.send(new cleanCSS(cssminifyOpts).minify(body));
  });

}


// run
var server = app.listen(process.env.PORT || defaultPort, function() {
  console.log('Listening on port %d.', server.address().port);
});
