var nameForm = document.getElementById('usernameForm');
var nameInput = document.getElementById('username');

// get the stored username value from localStorage, if it exists
var storedUsername = localStorage.getItem('username');

// if a username value was found, update the input field and the username variable
if (storedUsername) {
  nameInput.value = storedUsername;
  username = storedUsername;
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

});


var socket = io();
      
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message',`<strong>${username}: </strong>${input.value}`);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.innerHTML = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});  

// socket.on('connect', function() {
//   socket.emit('user connected', username);
// });

// socket.on('user connected', function(user) {
//   var connectionItem = document.createElement('li');
//   connectionItem.innerHTML = `<strong>${user}</strong> has connected!`;
//   messages.appendChild(connectionItem);
//   window.scrollTo(0, document.body.scrollHeight);
// });

