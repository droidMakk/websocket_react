const WsClient = require('websocket').client

const ws = new WsClient()

ws.connect('ws://localhost:8080', 'echo-protocol')
ws.on('connect', () => {
    console.log('connected')
})