const express = require('express');
const router = express.Router();

// Load User model
const {BlackList,Class}=require('../models');

router.get('/',(req,res)=>{
    BlackList.find()
        .then((blackList)=>{
            res.send({blackList:blackList})
        })
        .catch(err =>{ console.log(err)});
})

router.post('/userBlock', async(req,res)=>{
    const {userID} = req.body.userID;
    await BlackList.updateOne({'BlackList.userID': userID},
        {
            
            $set: {
                'BlackList.$.state': true
            }
        }).then(res=>{console.log('success')});
        await Class.updateOne({'BlackList.userID': userID},
        {
            $set: {
                'BlackList.$.state': true
            }
        })
        console.log(req.body.userID);
})

router.post('/userRelease', async (req,res)=>{
    
    const {userID, classCode} = req.body;
    console.log(userID);
    console.log(classCode);
    await BlackList.updateOne({classCode:classCode,'BlackList.userID': userID},
        {
            $set: {
                "BlackList.$.state": false
            }
        }).catch(err=>console.log(err));
    await Class.updateOne({classCode:classCode,'BlackList.userID': userID},
        {
            $set: {
                "BlackList.$.state": false
            }
        }).then(result=>res.send(true))
        .catch(err=>console.log(err));
})

router.post('/userDelete', async (req,res)=>{
    const {userID, classCode} = req.body;

    await Class.findAndUpdate(
        {classCode:classCode},
        {$pull: { "BlackList": {
                    userID: userID
                }}}
    ).catch(err=> {
            console.log(err);
        })
    await BlackList.findAndUpdate(
        {classCode:classCode},
        {$pull: { "BlackList": {
                    userID: userID
                }}}
    ).then(result => {
        res.send(true)
    })
        .catch(err=> {
            console.log(err);
        })
})


module.exports = router;
