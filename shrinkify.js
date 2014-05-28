// imports
var express = require('express');
var logfmt = require('logfmt');
var htmlminify = require('html-minifier').minify;
var textBody = require('body');
var compress = require('compression');


// globals
var app = express();
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


// config
app.use(compress());
app.use(logfmt.requestLogger());


// routes
app.post('/html', shrinkHTML);


// views
function shrinkHTML(req, res) {

  // Grab the body of the POST request as text.
  textBody(req, function(err, body) {

    // Now we'll compress the HTML / CSS / JS and return it!
    res.send(htmlminify(body, htmlminifyOpts));
  });

}


// run
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d.', server.address().port);
});
