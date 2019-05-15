const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Answer_S = mongoose.model('Answer_S');

// const IOserver = require('../app');
// const io = require('socket.io')(IOserver);

const app = require('../app');
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
        let time = new Date();

        let T = time.getFullYear().toString()+'-'+(time.getMonth()+1).toString()
            +'-'+time.getDate().toString()+" "+time.getHours().toString()+":"+time.getMinutes().toString();
        const newQuestion = new Question({
            classCode: data.classCode,
            userID: data.userID,
            userName: data.userName,
            question: data._question,
            anonymous: data.anonymous,
            date: T
        });
        newQuestion.save()
        .then(result => {
            io.sockets.in(data.classCode).emit('MESSAGE', data)
        })
        .catch(err => io.emit(err))
    });
    socket.on('servey', function(data) {
        // classCode: { type: String, required: true },
        // userID: { type: String, required: true },
        // SID: { type: Number, required: true },
        // content: { type: String, required: true }
        const newAnswer_S = new Answer_S({
            classCode: data.classCode,
            userID: data.userID,
            SID: data.SID,
            content : data.content
        });
        newAnser_S.save()
            .then(result => {
                console.log('성공');
                io.sockets.in(data.classCode).emit('MESSAGE', data)
            })
            .catch(err => io.emit(err))
    });

});
