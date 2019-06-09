
const express = require('express');
const router = express.Router();

// Load User model
const {Class,User,Question,Survey,Answer_S,Quiz,Answer_Q,BlackList}=require('../models');

const Relocate = (list1,list2,element) => {
    let list = [];
    for(let i=0;i<list1.length;i++){
        for(let j=0;j<list2.length;j++){
            if(list1[i][`${element}`]==list2[j][`${element}`]){
                list.push(list2[j])
                break;
            }
            else{
                if(j==list2.length-1)
                    list.push({None: 0})
            }
        }
    }
    return list
}
const Check = (list1,list2,element,name) => {
    let list = [];
    let val;
    for(let i=0;i<list1.length;i++){
        val=0;
        for(let j=0;j<list2.length;j++){
            if(list1[i][`${element}`]==list2[j][`${element}`]){
                val=1;
                break;
            }
        }
        if(val==0)
            list.push({Name : list1[i][`${name}`]});
    }
    return list
}


router.post('/', (req,res)=>{
    let sessionCheck = false;
    if (typeof req !== 'undefined' && typeof req.user !== 'undefined') {
        sessionCheck = true
    }
    res.send(sessionCheck);

    });


router.post('/enter', (req, res) => {
    const {classCode,userID} = req.body;
    let classInput;
    // BlackList.find({classCode: classCode})
    //     .then(List=>{
    //         if(List) {
    //             for(let i=0;i<List.BlackList.length;i++){
    //                 if(List.BlackList[i].userID==userID)
    //                     res.send(ture)
    //             }
    //         }
    //     })
    Class.findOne({classCode: classCode})
    .then(thisClass => {
        if (thisClass) {
            classInput = {
                className:thisClass.className,
                profName:thisClass.profName
            };
            res.send(classInput);
        }
        else {
            res.send(false);//없는 클래스접근 시도
        }
    });
});
router.post('/:classCode/home',async(req,res)=>{
    const {classCode} = req.params;
    const {userID}=req.body;
    let newQuestion=[];
    let newSurvey=[];
    let newQuiz=[];
    let moment = require("moment");
    moment.locale("ko");
    let now=moment().format("LLL");
    await Question.find({classCode:classCode})
        .then(List => {
            if(List.length>0) {
                let n=0;

                for(let i=0;i<now.length;i++){
                    if(now[i]=='오'){
                        n=i;
                        break;
                    }
                }
                console.log(now.substring(0,n))
                for(let i=0;i<List.length;i++){
                    if(now.substring(0,n)==List[i].date.substring(0,n)
                        &&List[i].userID!=userID) {
                        newQuestion.push(List[i].question)
                    }
                }
            }
        })
        .catch(err=> {
            console.log(err);
        })
    await Survey.find({classCode: classCode})
        .then(List => {
            Answer_S.find({classCode: classCode ,userID: userID}).
            then(myAnswer_S=>{
                for(let i=0;i<List.length;i++){
                    if(List[i].active==false){
                        List.splice(i,1);
                    }
                }
                    newSurvey = Check(List, myAnswer_S, "SID","surveyName");
            })
        })
        .catch(err=> {
            console.log(err);
        })
    await Quiz.find({classCode: classCode})
        .then(List => {
            Answer_Q.find({classCode: classCode ,userID: userID}).
            then(myAnswer_Q=>{
                    for(let i=0;i<List.length;i++){
                        if(List[i].active==false){
                            List.splice(i,1);
                        }
                    }
                    newQuiz = Check(List, myAnswer_Q, "QID","quizName");
                let data = {newQuestion:newQuestion,newSurvey:newSurvey,newQuiz:newQuiz};
                console.log(data);
                res.send({newQuestion:newQuestion,newSurvey:newSurvey,newQuiz:newQuiz});
            })
        })
        .catch(err=> {
            console.log(err);
        })
})

router.get('/:classCode/classAdd', (req, res) => {
    const {classCode} = req.params
    Class.findOne({classCode: classCode})
        .then(thisClass => {
            if (thisClass) {
                const classInput = {
                    classCode:thisClass.classCode,
                    className:thisClass.className,
                    profName:thisClass.profName
                };
                User.findByIdAndUpdate(
                    req.user._id,
                    {$push: { "classList": classInput}}
                )
                    .then(result => {
                        res.send(classInput);
                    })
            }
            else{
                res.send(false);
            }
        }).catch(err => {
        console.log(err);
    });
});

router.delete('/:classCode/delete', (req, res) => {
    const {classCode} = req.params;
    User.findByIdAndUpdate(
        req.user._id,
        {$pull: { "classList": {
            classCode:classCode
        }}}
    ).then(result => {
        res.send(true)
    })
    .catch(err=> {
        console.log(err);
    })
});

router.post('/:classCode/question',(req,res)=>{
    let {classCode}=req.params;
    Question.find({classCode:classCode})
            .then(List => {
                res.send({questionList: List})
            })
            .catch(err=> {
                console.log(err);
            })
});

router.delete('/:classCode/questionDelete',(req,res)=>{
    let {classCode}=req.params;
    let {QesID}=req.body
    Question.findOne({QesID : QesID })
        .then(result => {
            if(result)
            {result.remove()}
            res.send(true)
        })
        .catch(err=> {
            console.log(err);
        })
});

router.post('/:classCode/survey',(req,res)=>{
    let {classCode}=req.params;
    const {userID}=req.body;

    Survey.find({classCode: classCode})
        .then(List => {
            Answer_S.find({classCode: classCode,userID:userID}).
            then(myAnswer_S=>{
                let list;
                if(myAnswer_S.length>0) {
                    list = Relocate(List, myAnswer_S, "SID");
                }
                else{
                    list = new Array(List.length).fill({None: 0})
                }
                res.send({surveyList: List, myAnswer_S: list});
            })
        })
        .catch(err=> {
            console.log(err);
        })
});

router.post('/:classCode/surveyAnswer_S',(req,res)=>{
    let { answer_S } = req.body;
    const newAnswer_S = new Answer_S(answer_S);
    newAnswer_S.save();
    Survey.findOne({ SID: answer_S.SID })
        .then(thisSurvey => {
            if(thisSurvey) {
                for (let i = 0; i < answer_S.surveyType.length; i++) {
                    if (Number(answer_S.surveyType[i]) < 3) {
                        let check = parseInt(answer_S.answer[i]);
                        while (check >= 1) {
                            thisSurvey.surveyList[i].count[check % 10 - 1]++;
                            check = parseInt(check / 10)
                        }
                    } else {
                        thisSurvey.surveyList[i].content.push(answer_S.answer[i]);
                    }
                }
                Survey.updateOne({SID: answer_S.SID}, {surveyList: thisSurvey.surveyList})
                    .then(result => {
                        res.send(true);
                    })
            }
        })
})

router.post('/:classCode/quiz',(req,res)=>{
    let {classCode}=req.params;
    const {userID}=req.body;

    Quiz.find({classCode: classCode})
        .then(List => {
            Answer_Q.find({classCode: classCode,userID:userID}).
            then(myAnswer_Q=>{
                let list;
                if(myAnswer_Q.length>0) {
                    list = Relocate(List, myAnswer_Q, "QID");
                }
                else{
                    list = new Array(List.length).fill({None : 0})
                }
                res.send({quizList: List, myAnswer_Q: list});
            })
        })
        .catch(err=> {
            console.log(err);
        })
});

router.post('/:classCode/quizAnswer_Q',(req,res)=>{
    let { answer_Q } = req.body;
    let score = 0;
    Quiz.findOne({ QID: answer_Q.QID })
        .then(thisQuiz => {
            for (let i = 0; i < answer_Q.quizType.length; i++) {
                if(thisQuiz.quizList[i].correct==answer_Q.answer[i]){
                    score=score+thisQuiz.quizList[i].point;
                    thisQuiz.quizList[i].correctNumber=thisQuiz.quizList[i].correctNumber+1;
                }
                if (Number(answer_Q.quizType[i]) < 3) {
                    let check = parseInt(answer_Q.answer[i]);
                    while (check >= 1) {
                        thisQuiz.quizList[i].count[check % 10 - 1]++;
                        check = parseInt(check / 10)
                    }
                }
                else{
                    thisQuiz.quizList[i].content.push(answer_Q.answer[i]);
                }
            }
            Quiz.updateOne({ QID: answer_Q.QID }, { quizList: thisQuiz.quizList })
                .then(result => {
                    answer_Q.score=score;
                    const newAnswer_Q = new Answer_Q(answer_Q);
                    newAnswer_Q.save();
                    res.send(true);
                })
        })
})
router.post("/:classCode/statistics", (req, res) => {
    let { classCode } = req.params;
    let { studentID } = req.body;
    let avg = 0;
    let max = 0;
    let mid = 0;
    let top5 = 0;
    let user = 0;
    let data = {};

    Question.aggregate([
        { $match: { classCode: classCode } },
        {
            $group: {
                _id: "$studentID",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ])
        .then(List => {
            if (List) {
                let professor = -1;
                let student = List.length;
                let top = 0;

                max = List[0].count;
                mid = List[parseInt(List.length / 2)].count;

                for (let i = 0; i < List.length; i++) {
                    if (List[i]._id == "9999") {
                        professor = i;
                    } else {
                        if (List[i]._id == studentID) {
                            user = List[i].count;
                        }
                        if (i < 5) {
                            top5 = (top5 * top + List[i].count) / (top + 1);
                            top++;
                        }
                        if (i == 5 && professor > 0) {
                            top5 = (top5 * top + List[i].count) / (top + 1);
                            top++;
                        }
                        avg = avg + List[i].count;
                    }
                }
                if (professor != -1) {
                    List.splice(professor, 1);
                    --student;
                }
                avg = avg / student;
                data = {
                    top5: parseInt(top5),
                    user: user,
                    avg: parseInt(avg),
                    max: max,
                    mid: mid
                };
                res.send({ data: data });
            }
        })
        .catch(err => {
            console.log(err);
        });
});
router.post("/:classCode/statistics/quiz", async (req, res) => {
    let { classCode } = req.params;
    let { QID } = req.body;
    let avg = 0;
    let max = 0;
    let mid = 0;
    let min = 0;
    let top5 = 0;
    let data = {};
    let correctRate=[];
    await Quiz.findOne({QID:QID})
        .then(List=>{
            if(List) {
                for (let i = 0; i < List.quizList.length; i++) {
                    correctRate.push(List.quizList[i].correctNumber);
                }
            }
        })
    await Answer_Q.aggregate([
        { $match: { QID: QID } },
        {
            $group: {
                _id: "$studentID",
                count: { $sum: "$score" }
            }
        },
        { $sort: { count: -1 } }
    ])
        .then(List => {
            if (List) {
                let student = List.length;
                let top = 0;
                max = List[0].count;
                for(let i=0;i<correctRate.length;i++){
                    correctRate[i]=parseInt(correctRate[i]/student*100);
                }
                if (parseInt(List.length / 2) > 1) {
                    min = List[parseInt(List.length / 2) - 1].count;
                }
                mid = List[parseInt(List.length / 2)].count;
                for (let i = 0; i < List.length; i++) {
                    if (i < 5) {
                        top5 = top5 + List[i].count;
                        top++;
                    }
                    avg = avg + List[i].count;
                }
                avg = avg / student;
                top5 = top5 / top;
                data = {
                    top5: top5.toFixed(1),
                    avg: avg.toFixed(1),
                    max: max,
                    min: min,
                    mid: mid,
                };
                console.log(data);
                console.log(correctRate);
                res.send({ data: data, correctRate: correctRate });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;
