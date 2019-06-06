const mongoose = require('mongoose');

const BlackListSchema = new mongoose.Schema({
  classCode: { type:String, required:true },
  BlackList : [
    new mongoose.Schema({
      profID: { type:String, required:true },
      contents: { type:String, required:true },
      userID: { type:String, required:true },
      userName: { type:String, required:true },
        }, { _id: false }
    )]
});

const BlackList = mongoose.model('BlackList', BlackListSchema);

module.exports = BlackList;
