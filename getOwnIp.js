var _ = require('lodash-node');


// Jumbo-mambo, any better way or a working module?
var lookup = process.argv[3] ? new RegExp(process.argv[3]) : /^192\.168\.\d+\.\d+$/;
var interfaces = require('os').networkInterfaces();
var ifNames = Object.keys(interfaces);
var local, networks;

// find local ip address
for (var i = 0, l = ifNames.length; i < l; i++) {
  networks = interfaces[ifNames[i]];
  local = _.find(networks, function (network) {
    return network.family === 'IPv4' && lookup.test(network.address);
  });
  if (local) {
    local = local.address;
    break;
  }
}

module.exports = local;
