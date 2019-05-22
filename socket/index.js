const app = require('../app');
const {Question,Survey,Answer_S,Quiz,Answer_Q}=require('../models');

const server = app.listen(3000, function () {
    console.log('Socket running on port 3000');
});
const io = require('socket.io')(server);
const questionIO = io.of('/question');
const surveyIO = io.of('/survey');

questionIO.on('connect', (socket) => {
    socket.on('channelJoin', (data) => {
        const { classCode, Identity, userName, userID } = data;
        const user = { Identity: Identity, userName: userName, userID: userID, classCode: classCode }
        socket.user = user
        socket.join(classCode);
        questionIO.to(classCode).clients((err, clients) => {
            console.log('질문클래스 인원:'+clients.length);
        });
        questionIO.to(classCode).emit('joinSuccess', user);
    })
    socket.on('getUsers', async (data) => {
        const { classCode, socketID } = data;

        let users = []
        await questionIO.to(classCode).clients((err, clients) => {
            clients.forEach(client => {
                const user = questionIO.connected[client].user;
                users.push(user);
            });
        });
        questionIO.to(socketID).emit('getUsers', users)
    })
    socket.on('chat', (data) => {
        const { classCode } = data
        const newQuestion = new Question(data);
        newQuestion.save()
            .then(result => {
                questionIO.to(classCode).emit('MESSAGE', data)
            })
            .catch(err => console.log(err))
    });
    socket.on('disconnect', () => {
        const user = socket.user;
        if (user) {
            questionIO.to(user.classCode).emit('disconnect', user)
            socket.leave(user.classCode)
        }
    });
});

surveyIO.on('connect', (socket) => {
    socket.on('channelJoin', (data) => {
        const { classCode, Identity, userName, userID } = data;
        const user = { Identity: Identity, userName: userName, userID: userID, classCode: classCode }
        socket.user = user
        socket.join(classCode);
        surveyIO.to(classCode).clients((err, clients) => {
            console.log('설문클래스 인원:'+clients.length);
        });
        surveyIO.to(classCode).emit('joinSuccess', true);
    })
    socket.on('survey', (data) => {
        let { answer_S } = data;
        const newAnswer_S = new Answer_S(answer_S);
        newAnswer_S.save();
        Survey.findOne({ SID: answer_S.SID })
        .then(thisSurvey => {
            for (let i = 0; i < answer_S.surveyType.length; i++) {
                if (Number(answer_S.surveyType[i]) < 3) {
                    let check = parseInt(answer_S.answer[i]);
                    while (check >= 1) {
                        thisSurvey.surveyList[i].count[check % 10 - 1]++;
                        check = parseInt(check / 10)
                    }
                } else{
                    thisSurvey.surveyList[i].content.push(answer_S.answer[i]);
                }
            }
            Survey.updateOne({ SID: answer_S.SID }, { surveyList: thisSurvey.surveyList })
            .then(result => {
                surveyIO.to(result.classCode).emit("survey", answer_S)
            })
        })
    });
})
