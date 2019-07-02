/**
 * Module dependencies - MrZ
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration - MrZ
 */

// Environments  - MrZ
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// Development only - MrZ
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// Production only - MrZ
if (app.get('env') === 'production') {
  // Basic Error Handling for now,
  app.use(express.errorHandler());
};

/**
 * Routes As Express(MiddleWare) - MrZ
 */

app.get('/', routes.index);
//app.get('/partials/:name', routes.partials);

// Redirect all others to the index (HTML5 history) - MrZ
app.get('*', routes.index);

// Socket.io Communication - MrZ
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server - MrZ
 */

server.listen(app.get('port'), function() {
  console.log('Express server ' + app.get('port'));
});
