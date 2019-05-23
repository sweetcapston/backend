const app = require('./app');

const server = app.listen(3000, function() {
    console.log('Socket running on port 3000');
});
  
const io = require('socket.io')(server);
io.on('connection', function(socket) {
    socket.on('chat', function(data) {
        console.log(data);
        io.emit('MESSAGE', data)
    });
    socket.on('survey', function(data){

    })
});