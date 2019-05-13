const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const url = 'http://localhost:5000';
var agent = chai.request.agent(url);


describe('# Student test', () => {
    const classCode = "prtvne";
    describe('ClassAdd & Delete test', () => {
        it('클래스 목록에 추가 성공', done => {
            agent.post('/users/login')
            .type('form')
            .send({
                'userID': 'testS@email.com',
                'password': 'qwe123'
            })
            .end((err, res) => {
                agent.get(`/stud/${classCode}/classAdd`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.text).to.be.an('String');
                    done();
                })
            })

        });
        it('클래스목록에서 삭제 성공', done => {
            agent.delete(`/stud/${classCode}/delete`)
            .type('form')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.equal(true);
                done();
            })
        });
        it('질문하기 목록 받아오기', done => {
            agent.post('/users/login')
                .type('form')
                .send({
                    'userID': 'testS@email.com',
                    'password': 'qwe123'
                })
                .end((err, res) => {
                    agent.post(`/stud/prtvne/question`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            //expect(res.text).to.equal(true);
                            done();
                        })
                })
        });

    });
})
