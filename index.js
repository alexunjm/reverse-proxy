var http = require('http'),
    net = require('net'),
    _c = require('colors'),
    url = require('url'),
    httpProxy = require('http-proxy');//https://github.com/http-party/node-http-proxy/blob/master/examples/http/basic-proxy.js

var welcome = [
  '#    # ##### ##### #####        #####  #####   ####  #    # #   #',
  '#    #   #     #   #    #       #    # #    # #    #  #  #   # # ',
  '######   #     #   #    # ##### #    # #    # #    #   ##     #  ',
  '#    #   #     #   #####        #####  #####  #    #   ##     #  ',
  '#    #   #     #   #            #      #   #  #    #  #  #    #  ',
  '#    #   #     #   #            #      #    #  ####  #    #   #  '
].join('\n');

console.log(welcome.rainbow);


var proxy = httpProxy.createServer();

var server = http.createServer(function (req, res) {
  console.log('Receiving reverse proxy request for: ' + req.url);
  var parsedUrl = url.parse(req.url);
  var target = parsedUrl.protocol + '//' + parsedUrl.hostname;
  proxy.web(req, res, {target: target, secure: false});
}).listen(8213);

server.on('connect', function (req, socket) {
  console.log('Receiving reverse proxy request for:' + req.url);

  var serverUrl = url.parse('https://' + req.url);

  var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function() {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
    'Proxy-agent: Node-Proxy\r\n' +
    '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});

console.log('http proxy server'.blue + ' started '.green + 'on port '.blue + '8213'.yellow);