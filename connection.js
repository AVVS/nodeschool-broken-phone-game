
function Connection(socket, cluster, activeConnections) {
  var _this = this;

  var remoteAddress = socket.remoteAddress;

  console.log('Connected to %s', remoteAddress);

  this.socket = socket;

  socket.on('error', function (err) {
    // do smth, for now just close the socket
    console.error('Problem with socket on %s: ', remoteAddress, err);
    socket.destroy();
  });

  // cleanup
  socket.on('close', function () {
    console.log('Client %s disconnected', remoteAddress);
    cluster[remoteAddress] = null;
    _this.socket = null;
  });

  socket.setKeepAlive(true);
  socket.setEncoding('utf-8');

  socket.on('data', this.interpretCommand.bind(this));

  // sniff
  this.sendCommand('DISCOVERY', activeConnections());
}

Connection.prototype.end = function () {
  this.socket.end();
};

Connection.prototype.sendCommand = function (cmd, data) {
  if (!data) {
    throw new Error('Data must be a string or an object');
  }

  if (typeof data === 'object' && data) {
    data = JSON.stringify(data);
  }

  this.socket.write('CMD::' + cmd + '::' + data + '\n');
};

Connection.prototype.interpretCommand = function (data) {
  process.stdout.write('Command_inc: ' + data);
};

module.exports = Connection;
