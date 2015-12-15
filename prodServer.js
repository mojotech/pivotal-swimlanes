var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.prod');
var request = require('request');
var app = express();
var compiler = webpack(config);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function() {
  console.log('Listening at http://localhost:' + port);
});

app.post('/authorize_github', function(req, res) {
  // TODO: add unguessable state parameter to prevent CSRF
  request('https://github.com/login/oauth/access_token?client_id=' + process.env.GITHUB_CLIENT_ID + '&client_secret=' + process.env.GITHUB_CLIENT_SECRET + '&code=' + req.query.code + '&redirect_uri=' + process.env.HOST + '/github_authorized&scope=repo,user', function (error, response, body) {
    var json_response = {};
    body.split('&').forEach(function(el) {
      var key = el.split('=')[0];
      var value = el.split('=')[1];
      json_response[key] = value
    });
    res.send(json_response.access_token);
  }.bind(res))
});

app.post('/authorize_heroku', function(req, res) {
  request.post('https://id.heroku.com/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&client_secret=' + process.env.HEROKU_SECRET, function (error, response, body) {
    res.send(body);
  }.bind(res))
});


// app.use(express.static(path.join(__dirname, 'static')));

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

