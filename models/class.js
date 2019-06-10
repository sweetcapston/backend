const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  classCode: { type:String, required:true, unique:true }, 
  className: { type:String, required:true },
  profID: { type:String, required:true },
  profName: { type:String, required:true },
  start: { type:Boolean, default: false },
  alarm: { type:Boolean, default: true },
  BlackList : [
    new mongoose.Schema({
      userID: { type:String, required:true },
      userName: { type:String, required:true },
      state: {type:Boolean, default: false}
        }, { _id: false }
    )]
});

module.exports = mongoose.model('Class', ClassSchema);

