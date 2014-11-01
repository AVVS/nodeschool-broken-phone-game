var _ = require('lodash-node');
var net = require('net');

// Connection
var Connection = require('./connection.js');
var scan = require('./scanner.js');

// Create server
var cluster = {};
var port = process.argv[2] || 8000;
var server = net.createServer();
var statsInterval;
server.listen(port);

statsInterval = setInterval(function () {
  var keys = Object.keys(cluster);
  keys = keys.filter(function (addr) {
    return cluster[addr];
  });

  console.log('Clients connected: ', keys);
}, 5000);

server.on('listening', function () {
  console.log('Listening on port', port);

  // pass shared state of connections
  scan(cluster, port);
});

server.on('connection', function (socket) {

  var remoteAddress = socket.remoteAddress;
  var existingConnection = cluster[remoteAddress];

  // we already have a connection, close it
  if (existingConnection) {
    console.log('We already have an existing connection from %s', remoteAddress);
    return socket.end();
  }

  console.log('New connection from outside: ', remoteAddress);
  cluster[remoteAddress] = new Connection(socket, cluster);

});

server.on('close', function () {
  process.exit(0);
});

process.on('SIGINT', function () {
  try {
    clearInterval(statsInterval);
    server.close();
    for (var address in cluster) {
      cluster[address] && cluster[address].end();
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});