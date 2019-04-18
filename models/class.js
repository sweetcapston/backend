const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  classcode: { type:String, required:true, unique:true }, 
  classname: { type:String, required:true },
  profID: { type:String, required:true },
  profname: { type:String, required:true },
  start: { type:Boolean, default: false },
  alarm: { type:Boolean, default: true },
});

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
