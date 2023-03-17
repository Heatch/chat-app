const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var userNames = {};

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });

    socket.on('user connected', (user) => {
      console.log(`${user} has connected!`);
      io.emit('user connected', user);
      username = user;
    });

    socket.on('setSocketId', (data) => {
      var userName = data.name;
      var userId = data.userId;
      userNames[userId] = userName;
    });

    socket.on('disconnect', () => {
      console.log(`${userNames[socket.id]} has disconnected!`);
      io.emit('user disconnected', userNames[socket.id]);
    });

  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});