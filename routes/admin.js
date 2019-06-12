const express = require('express');
const router = express.Router();

// Load User model
const {BlackList,Class}=require('../models');

router.get('/admin',(req,res)=>{
    BlackList.find()
        .then((BlackList)=>{
            res.send(BlackList)
        })
        .catch(err =>{ console.log(err)});
})

router.get('/admin/userBlock', async (req,res)=>{
    const {classCode,userID} = req.body;
    await BlackList.updateOne({'BlackList.userID': userID},
        {
            $set: {
                "BlackList.$.state": true
            }
        }).then()
    await Class.updateOne({'BlackList.userID': userID},
        {
            $set: {
                "BlackList.$.state": true
            }
        })
})

router.get('/admin/userRelease', async (req,res)=>{
    const userID = req.body;
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


module.exports = router;
