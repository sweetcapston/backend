const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const UserSchema = new mongoose.Schema({
  userName: {type: String, required: true},
  studentId: { type: String, default:"9999" }, //prof == "9999"
  userID: {type: String, required: true},
  password: {type: String, required: true},
  date: {type: Date, default: Date.now},
  classList : [
    new mongoose.Schema({
            classCode: { type:String, required:true },
            className: { type:String, required:true },
            profName: { type:String, required:true }
        }, { _id: false }
    )]
});

module.exports = mongoose.model('user', UserSchema);

