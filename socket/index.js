const app = require('../app');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Answer_S = mongoose.model('Answer_S');
const Survey = mongoose.model('Survey');
const server = app.listen(3000, function() {
    console.log('Socket running on port 3000');
});
const io = require('socket.io')(server);
const questionIO = io.of('/question');
const surveyIO = io.of('/survey');

questionIO.on('connect', (socket) => {
    socket.on('channelJoin', (data) => {
        const {classCode, Identity, userName, userID} = data;
        const user = {Identity:Identity, userName:userName, userID:userID, classCode: classCode}
        socket.user = user
        socket.join(classCode);
        questionIO.to(classCode).clients( (err,clients) => {
            console.log(clients.length);
        });
        questionIO.to(classCode).emit('joinSuccess', user);
    })
    socket.on('getUsers', async(data) => {
        const {classCode, socketID} = data;

        let users = []
        await questionIO.to(classCode).clients((err, clients) =>{
            clients.forEach(client => {
                const user = questionIO.connected[client].user;
                users.push(user);
            });
        });
        questionIO.to(socketID).emit('getUsers', users)
    })
    socket.on('chat', (data) => {
        const {classCode} = data
        const newQuestion = new Question(data);
        newQuestion.save()
        .then(result => {
            questionIO.to(classCode).emit('MESSAGE', data)
        })
        .catch(err => console.log(err))
    });
    socket.on('disconnect', () => {
        const user = socket.user;
        if(user) {
            questionIO.to(user.classCode).emit('disconnect', user)
            socket.leave(user.classCode)
        }
    });
});

surveyIO.on('connect', (socket) => {
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
        newAnswer_S.save()
            .then(result => {
                console.log('성공');
                surveyIO.to(data.classCode).emit('MESSAGE', data)
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
})