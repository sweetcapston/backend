const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const url = 'http://localhost:5000';
const socketurl = 'http://localhost:3001';
var agent = chai.request.agent(url);
var socketagent = chai.request.agent(socketurl);

describe('# Professor test', function () {
    let classInput;
    describe('질문하기 테스트', () => {
        it('클래스 생성 성공', done => {
            agent.post('/users/login')
                .type('form')
                .send({
                    'email': 'testP@email.com',
                    'password': 'qwe123'
                })
                .end((err, res) => {
                    socketagent.post('/prof/classCreate')
                        .type('form')
                        .send({
                            'className': 'testname'
                        })
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res.text).to.be.an('String');
                            classInput = res.body;
                            done();
                        })
                })
        });
    });
})
