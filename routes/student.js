
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load User model
const Class = mongoose.model('Class');
const User = mongoose.model('user');

router.post('/enter', (req, res) => {
    const {classCode} = req.body;
    Class.findOne({classCode: classCode})
    .then(clas => {
        if (clas) {
            res.send(true);
        }
        else res.send(false);//없는 클래스접근 시도
    });
});

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
                res.send(thisClass.classCode);
            })
        }
        else{
            res.send(false);
        }
    }).catch(err => {
        res.send(err);
    });

});

router.delete('/:classCode/delete', (req, res) => {
    const {classCode} = req.params
    User.findByIdAndUpdate(
        req.user._id,
        {$pull: { "classList": {
            classCode:classCode
        }}}
    ).then(result => {
        res.send(true)
    })
    .catch(err=> {
        res.send(err);
    })
});

module.exports = router;
