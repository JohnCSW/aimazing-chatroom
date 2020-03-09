const socket = require('socket.io');
module.exports = 
(server) =>
{
    const io = socket(server);
    io.on('connection', socket => 
    {
        socket.emit('joined', 'You have successfully joined the room!');
        socket.on('client-msg', msg => 
        {
            console.log(msg);
            // TODO: Must set user id to client in advance in order to
            // identify users.
            // TODO: Broadcast to all clients connected to the server.
            // TODO: Save messages as history for later browsing.
        });
    });
};