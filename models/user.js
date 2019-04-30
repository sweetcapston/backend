const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  StudentId: { type: String, default:"9999" }, //prof == "9999"
  email: {type: String, required: true},
  password: {type: String, required: true},
  date: {type: Date, default: Date.now},
  classList : [
    new mongoose.Schema({
          classcode: { type:String, required:true },
          classname: { type:String, required:true },
          profname: { type:String, required:true }
        }, { _id: false }
    )]
});

module.exports = mongoose.model('user', UserSchema);

