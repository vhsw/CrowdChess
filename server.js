#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
const { Chess } = require('chess.js');
var http = require('http');

const chess = new Chess();

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

let connections = [];


wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  connections.push(connection);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      // connection.sendUTF(message.utf8Data);
    }
  });
  connection.on('close', function (reasonCode, description) {
    connections = connections.filter(item => item !== connection);
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

function broadcast(msg) {
  connections.forEach(con => { con.send(msg); });
}


async function game() {
  console.log("New round");
  console.log(board);
  console.log(connections.length + " players connected");
  broadcast(board);
  console.log("\rWaiting for players moves..." + i + 's');
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log("End round");

}

console.log(chess.ascii());
console.log(chess.moves());
console.log(chess.ascii());
