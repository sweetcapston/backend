const app = require('../app');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');


const server = app.listen(3000, function() {
    console.log('Socket running on port 3000');
});

const io = require('socket.io')(server);
io.on('connection', function(socket) {
    socket.on('chat', function(data) {
        console.log(data.userID,data.userName);
        mongoose.connect('mongodb://106.10.46.89:27017/openclass', {
            user: "openclass",
            pass: "qwe123",
            authSource: "admin",
            useNewUrlParser:true
        } ).then(() => {
            console.log('Successfully connected to Socket mongodb')

            mongoose.Promise = global.Promise;
            mongoose.set('useCreateIndex', true);
            mongoose.set('useFindAndModify', false);

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
                    io.emit(true);
                    console.log('성공');
                    mongoose.connection.close();
                })
                .catch(err => io.emit(err))
        })
            .catch(e => console.error(e));

        io.emit('MESSAGE', data)
    });
    socket.on('survey', function(data){

    })
});
