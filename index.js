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
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('user connected', (user) => {
    console.log(`${user} has connected!`);
    socket.broadcast.emit('user connected', user);
    username = user;
  });

  socket.on('setSocketId', (data) => {
    var userName = data.name;
    var userId = data.userId;
    userNames[userId] = userName;
  });

  socket.on('disconnect', () => {
    console.log(`${userNames[socket.id]} has disconnected!`);
    if (userNames[socket.id]) {
      io.emit('user disconnected', userNames[socket.id]);
    }
  });

});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
