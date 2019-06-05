const express = require('express');
const router = express.Router();

// Load User model
const {Class,User,Question,Survey,Answer_S,Quiz,Answer_Q}=require('../models');

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
            res.send(err);
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
            res.send(err);
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
        res.send(err);
    })

    await Class.findOne({classCode: classCode})
    .then(thisclass => {
        if (thisclass) {
            thisclass.remove();
        }
    })
    .catch(err => {
        res.send(err);
    })
    await Question.deleteMany({classCode: classCode})
        .then(List => {

        })
        .catch(err=> {
            res.send(err);
        })
    await Survey.deleteMany({classCode: classCode})
        .then(List => {

        })
        .catch(err=> {
            res.send(err);
        })
    await Answer_S.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            res.send(err);
        })
    await Quiz.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            res.send(err);
        })
    await Answer_Q.deleteMany({classCode: classCode})
        .then(List => {
            res.send(true);
        })
        .catch(err=> {
            res.send(err);
        })
});

router.post('/:classCode/question',(req,res)=>{
    let {classCode}=req.params;
    Question.find({classCode:classCode})
        .then(List => {
            res.send({questionList: List})
        })
        .catch(err=> {
            res.send(err);
        })
});

router.post('/:classCode/surveyDelete', (req,res)=>{
    const{SID}=req.body;
    Survey.find({SID:SID})
        .then(result=>{
            if(result)
            result.remove();
        })
        .catch(err => {
            res.send(err);
        })
});

router.post('/:classCode/surveyAdd', (req,res)=>{
    const{survey}=req.body;
    const newSurvey=new Survey(survey);
    newSurvey.save()
    .then(result => {
        res.send(true);
    })
    .catch(err =>{ res.send(err)});
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
            res.send(true);
        })
        .catch(err =>{ res.send(err)});
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

router.put('/:classCode/quiz/active',(req,res)=>{
    const {QID, active} = req.body;
    Quiz.updateOne({ QID: QID }, { active: !active })
        .then((result) => {
            res.send(!active);
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/:classCode/QuizDelete', (req,res)=>{
    const{QID}=req.body;
    Quiz.find({QID:QID})
        .then(result=>{
            if(result)
                result.remove();
        })
        .catch(err => {
            res.send(err);
        })
});
router.post('/:classCode/statistics',(req,res)=>{
    let classCode = req.params;

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
                        if(List[i]._id==studentID){//{List[i]._id==studentID}
                            user=List[i].count;
                        }
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
                console.log(data);
                res.send({List:List,data:data});
            }
        })
        .catch(err=> {
            res.send(err);
        })
})

router.post('/:classCode/statistics/quiz',(req,res)=>{
    let {classCode} = req.params;
    let {QID} = req.body;
    let avg=0
    let max=0;
    let mid=0;
    let min=0;
    let top5=0;
    let data={}

    Answer_Q.aggregate([
        {'$match':{'QID': QID}},
        {'$group' :
                {
                    '_id' : '$userID',
                    'count' :{'$sum':'$score'}
                }
        },
        {'$sort':{'count':-1}},
    ])
        .then(List => {
            if(List){
                let student=List.length;
                let top=0;
                max=List[0].count;
                if(parseInt(List.length/2))
                {min=List[parseInt(List.length/2)-1].count;}
                mid=List[parseInt(List.length/2)].count;
                for(let i=0;i<List.length;i++){
                    if(i<5){
                        top5=top5+List[i].count
                        top++;
                    }
                    avg=avg+List[i].count
                }
                avg=avg/student;
                top5=top5/top;
                data={top5:top5.toFixed(1),user:user,avg:avg.toFixed(1),max:max,min:min,mid:mid};
                console.log(data);
                res.send({List:List,data:data});
            }
        })
        .catch(err=> {
            res.send(err);
        })
})

module.exports = router;
