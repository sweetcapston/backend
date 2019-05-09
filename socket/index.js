const app = require('../app');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');


const server = app.listen(3000, function() {
    console.log('Socket running on port 3000');
});

const io = require('socket.io')(server);
io.on('connection', function(socket) {
    socket.on('channelJoin', function(data){
        const {classCode, userID} = data;
        socket.join(classCode);
        io.of('/').in(classCode).clients(function (err,clients) {
            console.log(clients.length);
        });
        io.sockets.in(classCode).emit('joinSuccess', userID);
    })
    socket.on('chat', function(data) {
        const newQuestion = new Question({
            classCode: data.classCode,
            userID: data.userID,
            userName: data.userName,
            question: data._question,
            anonymous: data.anonymous,
            date: Date.now()
        });
        newQuestion.save()
        .then(result => {
            console.log('성공');
            io.sockets.in(data.classCode).emit('MESSAGE', data)
        })
        .catch(err => io.emit(err))
    });
});
