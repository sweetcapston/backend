var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var data1 = {
    classCode:"fcpd5b",
    userID:"testS@email.com",
    userName:"학생테스트",
    question:"test messsssssage",
    anonymous:false,
    date:"2019년 5월 16일 오후 7:33"
  };

var data2 = {
    classCode:"fcpd5b",
    userID:"testP@email.com",
    userName:"교수테스트",
    question:"test messsssssage",
    anonymous:false,
    date:"2019년 5월 16일 오후 7:33"

  };



describe("Socket test",function(){
    // it('Socket Connect & send receive', function(done){
    //     var client1 = io.connect(`${socketURL}/question`, options);
    //     var client2 = io.connect(`${socketURL}/question`, options);
    //     client2.on('chat', function(data){
    //         data.should.equal(data1);
    //     });
    //     client1.emit('chat', data1);
    //     client2.emit('chat', data2);
    //     client1.on('chat', function(data){
    //         data.should.equal(data2);
    //     });
    //     setTimeout(function(){
    //         client1.disconnect();
    //         client2.disconnect();
    //         done();
    //     }, 25);
    // });
    it('설문응답', done => {
        const client1 = io.connect(`${socketURL}/survey`, options);
        client1.emit("channelJoin", {
            Identity:1,
            userName:"학생테스트",
            userID:"testS@email.com",
            classCode:"prtvne"
        });
        client1.on("joinSuccess", data =>{
            data.should.equal(true);
        });
        const answer_S = {
            userID:'testS@email.com',
            userName: '',
            SID:'24',
            answer:['123', '123'],
            surveyType: [1, 1],
            studentID: '201900000',
            classCode: 'prtvne'
        };
        client1.emit("survey",{answer_S:answer_S})
        setTimeout(function(){
            client1.disconnect();
            done();
        }, 500);
        client1.on("survey", data =>{
            data.should.equal(answer_S);
        })
    });
});
