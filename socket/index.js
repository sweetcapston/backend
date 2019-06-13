const app = require('../app');
const {Class, Question,Survey,Answer_S,Quiz,Answer_Q, BlackList}=require('../models');
// const IOserver = require('../app');
// const io = require('socket.io')(IOserver);
const server = app.listen(3000, function () {
    console.log('Socket running on port 3000');
});
const io = require('socket.io')(server);
const questionIO = io.of('/question');
const surveyIO = io.of('/survey');
const quizIO = io.of('/quiz');
questionIO.on('connect', (socket) => {
    socket.on('channelJoin', (data) => {
        const { classCode, Identity, userName, userID } = data;
        const user = { Identity: Identity, userName: userName, userID: userID, classCode: classCode }
        socket.user = user
        socket.join(classCode); //같은 room에 입장 
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
                questionIO.to(classCode).emit('MESSAGE', result)
            })
            .catch(err => console.log(err))
    });
    socket.on('delete', (data)=>{
        let QesID = data
        Question.findOne({QesID : QesID })
        .then(result => {
            if(result){
                result.remove()
                questionIO.to(socket.user.classCode).emit("delete", result)
            }
        })
        .catch(err=> {
            console.log(err)
        })
    })
    socket.on("black", async(data) => {
        const blacklist = data.BlackList
        const {classCode, QesID} = data
        console.log(blacklist);
        console.log('here')
        
        await Question.findOne({QesID : QesID })
        .then(result => {
            if(result){
                result.remove()
                questionIO.to(socket.user.classCode).emit("delete", result)
            }
        })
        .catch(err=> {
            console.log(err)
        })

        await Class.findOne({classCode:classCode,'BlackList.userID':blacklist.userID})
            .then(user=>{
                if(!user){
                    Class.updateOne(
                    { classCode: classCode },
                    { $push: {BlackList: {
                                userID:blacklist.userID,
                                userName:blacklist.userName,
                                state:false
                            }}})
                    .then().catch(err =>{ console.log(err)});

                    BlackList.findOneAndUpdate({classCode:classCode},
                        {$push: { "BlackList": blacklist}})
                        .then()
                        .catch(err =>{ console.log(err)});
                }
        })
            .catch(err=>{console.log(err)});

        await BlackList.findOne({classCode:classCode})
        .then(List=>{
            if(!List){
                const newBlack = new BlackList({classCode:classCode});
                newBlack.save().then(result => {
                    BlackList.findOneAndUpdate({classCode:classCode},
                    {$push: { "BlackList": blacklist}})
                    .then()
                    .catch(err =>{ console.log(err)});
                })
            }
        }).catch(err =>{ console.log(err)});
    })

    socket.on("edit", (data) => {
        let {QesID, question, anonymous}=data
        Question.updateOne({QesID:QesID},{question:question, anonymous: anonymous})
        .then(result => {
            questionIO.to(socket.user.classCode).emit("edit", data)
        })
        .catch(err=> {
            console.log(err);
        })
    })
    socket.on('like', (data) => {
        const { QesID, userID } = data
        Question.updateOne(
            {QesID : QesID },
            {$push:{likeList:userID}})
        .then(result => {
            questionIO.to(socket.user.classCode).emit("like", {
                QesID:QesID,
                userID:userID
            })
        })
        .catch(err=> {
            console.log(err)
        })
    });
    socket.on("unlike", (data) => {
        const {QesID, userID}=data;
        Question.updateOne(
            {QesID:QesID},
            {$pull: { "likeList": userID}})
            .then(result => {
            questionIO.to(socket.user.classCode).emit("unlike", {
                QesID:QesID,
                userID:userID
            })
        })
        .catch(err=> {
            console.log(err);
        })
    })
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
    });
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
                surveyIO.to(answer_S.classCode).emit("survey", answer_S)
            })
        })
    });
    socket.on("delete", (data) => {
        const SID = data;
        Survey.findOne({SID:SID})
        .then(result=>{
            console.log(result)
            if(result) {
                result.remove();
                Answer_S.deleteMany({SID: SID})
                .then(List => {
                    surveyIO.to(socket.user.classCode).emit("delete", result)
                })
                .catch(err=> {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
})
quizIO.on('connect', (socket) => {
    socket.on('channelJoin', (data) => {
        const { classCode, Identity, userName, userID } = data;
        const user = { Identity: Identity, userName: userName, userID: userID, classCode: classCode }
        socket.user = user
        socket.join(classCode);
        quizIO.to(classCode).clients((err, clients) => {
            console.log('퀴즈클래스 인원:'+clients.length);
        });
        quizIO.to(classCode).emit('joinSuccess', user);
    })
    socket.on("quizStart",(data)=>{
        const {QID, minutes, date} = data;
        const totalTime = minutes * 60;
        
        Quiz.updateOne({ QID: QID }, { active: true, date:date, minutes:minutes })
        .then((result) => {
            socket.finish  = 
            setTimeout(()=>{
                setTimeout(() => {
                    Quiz.updateOne({ QID: QID }, { active: false})
                    .then((result) => {
                        quizIO.to(socket.user.classCode).emit("quizStop", {
                            active:false,
                            QID:QID
                        })
                    });
                }, 10000)
            }, 1000 * totalTime)
            quizIO.to(socket.user.classCode).emit("quizStart", {
                active:true,
                minutes:minutes,
                date:date,
                QID:QID
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
    socket.on("quizStop",(data)=>{
        const QID = data;
        Quiz.updateOne({ QID: QID }, { active: false})
        .then((result) => {
            clearTimeout(socket.finish);
            quizIO.to(socket.user.classCode).emit("quizStop", {
                active:false,
                QID:QID
            })
        })
        .catch(err => {
            console.log(err);
        })
    })

    socket.on("delete", (data) => {
        const QID = data;
        Quiz.findOne({QID:QID})
        .then(result=>{
            if(result) {
                result.remove();
                Answer_Q.deleteMany({QID: QID})
                .then(List => {
                    quizIO.to(socket.user.classCode).emit("delete", result);
                })
                .catch(err=> {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
})
