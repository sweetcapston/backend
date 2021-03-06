const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const url = 'http://localhost:5000';
var agent = chai.request.agent(url);


describe('# Student test', () => {
    const classCode = "0u6azb";
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
                    agent.post(`/stud/prtvne/question`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            done();
                        })

        });
        // it('설문 응답하기', done => {
        //     const answer_S = {
        //         userID:'testS@email.com',
        //         SID:'27',
        //         answer:['4', '34',"작은대왕"],
        //         studentID:'201900000',
        //         surveyType: [1, 2, 3],
        //         classCode: 'prtvne'
        //     };
        //     agent.post('/stud/prtvne/surveyAnswer_S')
        //         .type('form')
        //         .send({answer_S:answer_S})
        //         .end((err, res) => {
        //             expect(err).to.be.null;
        //             expect(res.body).to.equal(true);
        //             done();
        //         });
        // });
        it('설문 받아오기', done => {
            agent.post('/stud/prtvne/survey')
                .type('form')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body).to.be.an("Object");
                    done();
                });
        });
    });
})
