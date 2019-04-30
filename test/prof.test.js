const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const url = 'http://localhost:5000';
var agent = chai.request.agent(url);


describe('# Professor test', function () {
    describe('ClassCreate test', () => {
        it('클래스 생성 성공', done => {
            agent.post('/users/login')
            .type('form')
            .send({
                'email': 'user@email.com',
                'password': 'qwe123'
            })
            .end((err, res) => {
                agent.post('/prof/classcreate')
                .type('form')
                .send({
                    'classname': 'testname'
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.text).to.be.an('String');
                    done();
                })
            })
        });
    });
})