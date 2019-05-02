const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const url = 'http://localhost:5000';
var agent = chai.request.agent(url);


describe('# Professor test', function () {
    let classcode;
    describe('ClassCreate & Delete test', () => {
        it('클래스 생성 성공', done => {
            agent.post('/users/login')
            .type('form')
            .send({
                'email': 'testP@email.com',
                'password': 'qwe123'
            })
            .end((err, res) => {
                agent.post('/prof/classCreate')
                .type('form')
                .send({
                    'className': 'testname'
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.text).to.be.an('String');
                    classcode = res.text;
                    done();
                })
            })
        });
        it('클래스 삭제 성공', done => {
            agent.delete(`/prof/${classcode}/delete`)
                .type('form')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.equal(true);
                    done();
                })
        });
    });
})
