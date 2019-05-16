const app = require('../app');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Answer_S = mongoose.model('Answer_S');
const Survey = mongoose.model('Survey');
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
            date: data.date
        });
        newQuestion.save()
        .then(result => {
            io.sockets.in(data.classCode).emit('MESSAGE', data)
        })
        .catch(err => io.emit(err))
    });
    socket.on('survey', function(data) {
        const newAnswer_S = new Answer_S({
            classCode: data.classCode,
            userID: data.userID,
            SID: data.SID,
            content : data.content
        });
        newAnswer_S.save()
            .then(result => {
                console.log('성공');
                io.sockets.in(data.classCode).emit('MESSAGE', data)
            })
            .catch(err => io.emit(err))
            .then(result=>{
                if(data.surveyType<3){
                        let check = Number(data.content)
                        let c
                        while (check > 0) {
                            c = check % 10
                            //Survey.findAndUpdate()
                            //thisSurvey.count[c]++
                            check / 10
                        }
                }
            })
    });

});
