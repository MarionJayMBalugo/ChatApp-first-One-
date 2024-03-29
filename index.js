const express = require('express')
const fs = require('fs')
const app = express()
port = "1000"
const server = app.listen(port, () => {
    console.log('listening to port: ' + port)
})
var io = require('socket.io').listen(server);

app.use(express.static('public'))
var countUsers=0
app.get('/', (req, res) => {
    fs.readFile('./views/index.html', (err, data) => {
        res.writeHead(200, { 'content-type': 'text/html' })
        res.write(data)
        res.end()
    })
})

io.on('connection', function(socket){
    countUsers++
    
    socket.broadcast.emit('hi');
    io.emit('counter',countUsers);
    socket.on('chat message', function(msg,user){
      console.log('message of ' +user+" : "+msg);
      io.emit('chat message', msg,user);
      
    });
    socket.on('disconnect', function(){
        countUsers--
        console.log('user disconnected');
      });
  });
;
io.emit('some event', { for: 'everyone' });

app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});