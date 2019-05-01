const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const url = 'http://localhost:5000';
var agent = chai.request.agent(url);


describe('# Student test', function () {
    describe('ClassAdd test', () => {
        it('클래스 목록에 추가 성공', done => {
            agent.post('/users/login')
            .type('form')
            .send({
                'email': 'testS@email.com',
                'password': 'qwe123'
            })
            .end((err, res) => {
                agent.get('/stud/kvsfb6/classAdd')
                .type('form')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.text).to.be.an('String');
                    done();
                })
            })
        });
    });
    // describe('ClassDelete test', () => {
    //     it('클래스목록에서 삭제 성공', done => {
    //         agent.post('/users/login')
    //             .type('form')
    //             .send({
    //                 'email': 'testS@email.com',
    //                 'password': 'qwe123'
    //             })
    //             .end((err, res) => {
    //                 agent.get(`/stud/w3tdt9/delete`)
    //                     .type('form')
    //                     .end((err, res) => {
    //                         expect(err).to.be.null;
    //                         expect(res.body).to.equal(true);
    //                         done();
    //                     })
    //             })
    //     });
    // });
})
