const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  classCode: { type:String, required:true, unique:true }, 
  className: { type:String, required:true },
  profID: { type:String, required:true },
  profName: { type:String, required:true },
  start: { type:Boolean, default: false },
  alarm: { type:Boolean, default: true },
});

module.exports = mongoose.model('Class', ClassSchema);

