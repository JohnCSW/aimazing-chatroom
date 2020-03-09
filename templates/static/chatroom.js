const socket = io('http://localhost:5000');
const msgForm = document.querySelector('#msg-composer');
const msgInput = document.querySelector('#msg-composer > input[type=text]');

socket.on('joined', msg => 
{
    alert(msg);
});

msgForm.addEventListener('submit', e =>
{
    e.preventDefault();
    const msg = msgInput.value;
    // TODO: Get user id and send messages and timestamp 
    // along with it.
    // TODO: Get user id from local Storage or cookies
    socket.emit('client-msg', msg);
    msgInput.value = '';
});

