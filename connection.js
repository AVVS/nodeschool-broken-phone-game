
function Connection(socket, cluster) {
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

  socket.on('data', function (data) {
    process.stdout.write(data);
  });
}

Connection.prototype.end = function () {
  this.socket.end();
}


module.exports = Connection;
