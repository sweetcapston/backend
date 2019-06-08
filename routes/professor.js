const express = require('express');
const router = express.Router();

// Load User model
const {Class,User,Question,Survey,Answer_S,Quiz,Answer_Q,BlackList}=require('../models');

//6자리 난수 코드 생성
const CreateRandomCode = () => {
    let classCode = "";

    for(let i = 0; i<6; i++)
    {
        let ran=Math.floor(Math.random() * 36);
        if(ran<10)
            ran = ran + 48;
        else
            ran = ran + 87;
        classCode += String.fromCharCode(ran);
    }
    return classCode
}

router.post('/classCreate', async (req, res) => {
    const {className} = req.body;
    const classCode = CreateRandomCode();
    const newClass = new Class({
        classCode: classCode,
        className: className,
        profID: req.user.userID,
        profName: req.user.userName,
    });
    await newClass.save()
        .catch(err => {
            console.log(err);
            console.log(err);
        })
    await User.findByIdAndUpdate(
        req.user._id,
        {$push: { "classList": {
                    classCode:classCode,
                    className:className,
                    profName:req.user.userName
                }}}
        )
        .then(result => {
            const classInput = {
                classCode:classCode,
                className:className,
                profName:req.user.userName
            };
            res.send(classInput);
        })
        .catch(err => {
            console.log(err);
            console.log(err);
        })
});

router.delete('/:classCode/delete', async(req, res) => {
    const {classCode} = req.params
    await User.findByIdAndUpdate(
        req.user._id,
        {$pull: { "classList": {
            classCode:classCode
        }}}
    )
    .catch(err => {
        console.log(err);
    })

    await Class.findOne({classCode: classCode})
    .then(thisclass => {
        if (thisclass) {
            thisclass.remove();
        }
    })
    .catch(err => {
        console.log(err);
    })
    await Question.deleteMany({classCode: classCode})
        .then(List => {

        })
        .catch(err=> {
            console.log(err);
        })
    await Survey.deleteMany({classCode: classCode})
        .then(List => {

        })
        .catch(err=> {
            console.log(err);
        })
    await Answer_S.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            console.log(err);
        })
    await Quiz.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            console.log(err);
        })
    await Answer_Q.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            console.log(err);
        })
});
router.post('/:classCode/black',(req,res)=>{
    let {classCode}=req.params;
    let {blackList}=req.body;
    const newBlack = new BlackList(blackList);
    newBlack.save()
        .then(result => {
            res.send(true);
        })
        .catch(err =>{ console.log(err)});
})
router.post('/:classCode/home',(req,res)=>{
    const {classCode} = req.params;
    const {userID}=req.body;
    let newquestion=[];
    let moment = require("moment");
    moment.locale("ko");
    let now=moment().format("LLL");
    Question.find({classCode:classCode})
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
                        newquestion.push(List[i].question)
                    }
                }
            }
            res.send(newquestion)
        })
})

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

router.post('/:classCode/surveyAdd', (req,res)=>{
    const{survey}=req.body;
    const newSurvey=new Survey(survey);
    newSurvey.save()
    .then(result => {
        res.send(result);
    })
    .catch(err =>{ console.log(err)});
});

router.post('/:classCode/survey',(req,res)=>{
    let {classCode}=req.params;
    Survey.find({classCode: classCode})
    .then(List => {
        res.send({surveyList: List});
    })
    .catch(err=> {
        console.log(err)
    })
});

router.post('/:classCode/surveyEdit',(req,res)=>{
    let {SID, surveyName, surveyList, date}=req.body
    Survey.updateOne({SID:SID}, {surveyName : surveyName, surveyList:surveyList, date:date})
    .then(result => {
        Answer_S.deleteMany({SID: SID})
        .then(List => {
            res.send(req.body)
        })
        .catch(err=> {
            console.log(err);
        })
    })
    .catch(err=> {
        console.log(err);
    })
});
router.put('/:classCode/survey/active',(req,res)=>{
    const {SID, active} = req.body;
    Survey.updateOne({ SID: SID }, { active: !active })
    .then((result) => {
        res.send(!active);
    })
    .catch(err => {
        console.log(err);
    })
});

router.post('/:classCode/quizAdd', (req,res)=>{
    const{quiz}=req.body;
    const newQuiz=new Quiz(quiz);
    newQuiz.save()
        .then(result => {
            res.send(result);
        })
        .catch(err =>{ console.log(err)});
});

router.post('/:classCode/quiz',(req,res)=>{
    let {classCode}=req.params;
    Quiz.find({classCode: classCode})
        .then(List => {
            res.send({quizList: List});
        })
        .catch(err=> {
            console.log(err)
        })
});
router.post('/:classCode/quizEdit',(req,res)=>{
    let {QID, quizName, quizList, date}=req.body
    Quiz.updateOne({QID:QID}, {quizName:quizName, quizList:quizList, date:date})
    .then(result => {
        Answer_Q.deleteMany({QID: QID})
        .then(List => {
            res.send(req.body)
        })
        .catch(err=> {
            console.log(err);
        })
    })
    .catch(err=> {
        console.log(err);
    })
});

router.post('/:classCode/statistics',(req,res)=>{
    let {classCode} = req.params;

    let avg=0
    let max=0;
    let mid=0;
    let top5=0;
    let data={}

    Question.aggregate([
        {'$match':{'classCode': classCode}},
        {'$group' :
                {
                    '_id' : '$studentID',
                    'count' :{'$sum':1}
                }
        },
        {'$sort':{'count':-1}},
    ])
        .then(List => {
            if(List){
                let professor=-1
                let student=List.length
                let top=0
                max=List[0].count;
                mid=List[parseInt(List.length/2)].count;
                for(let i=0;i<List.length;i++){
                    if(List[i]._id=='9999'){
                        professor=i
                    }
                    else {
                        if(i<5){
                            top5=(top5*top+List[i].count)/(top+1)
                            top++;
                        }
                        if(i==5&&professor>0){
                            top5=(top5*top+List[i].count)/(top+1)
                            top++;
                        }
                        avg=avg+List[i].count
                    }
                }
                if(professor!=-1){
                    List.splice(professor,1)
                    --student;
                }
                avg=avg/student;
                data={top5:top5.toFixed(1),avg:avg.toFixed(1),max:max,mid:mid};
                res.send({List:List,data:data});
            }
        })
        .catch(err=> {
            console.log(err);
        })
})

router.post('/:classCode/statistics/quiz', async(req,res)=>{
    let { classCode } = req.params;
    let { QID } = req.body;
    let avg = 0;
    let max = 0;
    let mid = 0;
    let min = 0;
    let top5 = 0;
    let data = {};
    let correctRate=[];
    let point=[];
    await Quiz.findOne({QID:QID})
        .then(List=>{
            if(List) {
                for (let i = 0; i < List.quizList.length; i++) {
                    correctRate.push(List.quizList[i].correctNumber);
                    point.push(List.quizList[i].point);
                }
            }
        })
    await Answer_Q.aggregate([
        { $match: { QID: QID } },
        {
            $group: {
                _id: "$userName",
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
                console.log(List)
                console.log(point)
                console.log(data);
                console.log(correctRate);
                res.send({List:List,point:point, correctRate: correctRate,data: data });
            }
        })
        .catch(err => {
            console.log(err);
        });
})

module.exports = router;
