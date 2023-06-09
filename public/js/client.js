// THINGS I NEED TO ADD:
// 1. Database to store messages
// 2. Thing to show whose typing


var nameForm = document.getElementById('usernameForm');
var nameInput = document.getElementById('username');
var socket = io();

// get the stored username value from localStorage, if it exists
var storedUsername = localStorage.getItem('username');

// if a username value was found, update the input field and the username variable

function usernameObtained() {
  socket.emit('user connected', username);
  data = {name: username, userId: socket.id};
  socket.emit('setSocketId', data);
}

if (storedUsername) {
  nameInput.value = storedUsername;
  username = storedUsername;
  socket.on('connect', function() {
    usernameObtained();
  });
} else {
  document.getElementById('usernameBox').style.display = 'flex';
  var bodyChildren = document.querySelectorAll('body > *:not(#usernameBox)');
  bodyChildren.forEach(function(child) {
    child.style.filter = 'blur(5px)';
  });
}

// store the username value in localStorage on form submit
nameForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // get the value of the nameInput field
  username = nameInput.value;
  
  // store the value in local storage
  localStorage.setItem('username', username);
  
  // remove the blur from other elements
  var bodyChildren = document.querySelectorAll('body > *:not(#usernameBox)');
  bodyChildren.forEach(function(child) {
    child.style.filter = 'none';
  });
  
  // hide the username box
  document.getElementById('usernameBox').style.display = 'none';
  usernameObtained();

});
      
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var body = document.querySelector('body');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message',`<strong>${username}: </strong>${input.value}`);
    var item = document.createElement('li');
    item.innerHTML = `<strong>${username}: </strong>${input.value}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.innerHTML = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});  

socket.on('user connected', function(user) {
  var connectionItem = document.createElement('li');
  connectionItem.innerHTML = `<strong>${user}</strong> has connected!`;
  messages.appendChild(connectionItem);
  window.scrollTo(0, document.body.scrollHeight);
});

// Handle user disconnected event
socket.on('user disconnected', function(user) {
  var disconnectItem = document.createElement('li');
  disconnectItem.innerHTML = `<strong>${user}</strong> has disconnected!`;
  messages.appendChild(disconnectItem);
  window.scrollTo(0, document.body.scrollHeight);
});

let typingTimer;
let typing = false
const doneTypingInterval = 2000; // 2 second interval

$('#input').on('keyup', function() {
  // Clear the typing timer
  clearTimeout(typingTimer);

  // Start a new typing timer
  typingTimer = setTimeout(function() {
    typing = false;
    socket.emit('stopped typing');
  }, doneTypingInterval);

  // Emit the "typing" event
  if (!typing) {
    socket.emit('typing', username);
    typing = true;
  }
});

socket.on('typing', function(user) {
  var typingItem = document.createElement('span');
  typingItem.innerHTML = `${user} is typing...`;
  body.appendChild(typingItem);
});

socket.on('stopped typing', function() {
  var typingItem = document.querySelector('span');
  body.removeChild(typingItem);
});