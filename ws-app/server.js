const app = require('express')();
const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer(app);
server.listen(8080, function() {
    console.log((new Date().toLocaleTimeString()) + '--- server started: 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // TODO: Black list sites not allowed.
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date().toLocaleTimeString()) + ' origin: ' + request.origin + ' --rejected.');
      return;
    }
    
    const connection = request.accept('echo-protocol', request.origin);
    console.log((new Date().toLocaleTimeString()) + '--- connection accepted');
    const interval = setInterval(() => {
        const number = Math.floor(Math.random() * 100);   
        connection.send(number)
    }, 1500)

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('binary message: ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date().toLocaleTimeString()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        clearInterval(interval)
    });
});