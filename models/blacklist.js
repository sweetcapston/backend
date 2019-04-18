const mongoose = require('mongoose');

const BlackListSchema = new mongoose.Schema({
  classcode: { type:String, required:true }, 
  profID: { type:String, required:true },
  contents: { type:String, required:true },
  userID: { type:String, required:true },
  username: { type:String, required:true }
});

const BlackList = mongoose.model('BlackList', BlackListSchema);

module.exports = BlackList;
