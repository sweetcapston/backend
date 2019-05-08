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
    _question:"test messsssssage",
    anonymous:false
  };
var data2 = {
    classCode:"fcpd5b",
    userID:"testP@email.com",
    userName:"교수테스트",
    _question:"test messsssssage",
    anonymous:false
  };
describe("Socket test",function(){
    it('Socket Connect & send receive', function(done){
        var client1 = io.connect(socketURL, options);
        var client2 = io.connect(socketURL, options);
        client2.on('chat', function(data){
            data.should.equal(data1);
        });
        client1.emit('chat', data1);
        client2.emit('chat', data2);
        client1.on('chat', function(data){
            data.should.equal(data2);
        });
        setTimeout(function(){
            client1.disconnect();
            client2.disconnect();
            done();
        }, 25);
    });
});
