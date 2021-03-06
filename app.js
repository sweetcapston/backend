const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const cors = require('./config/cors');
var logger = require('morgan'); 
/*
서버에서 활성화
const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('/etc/letsencrypt/live/backend.openclass.ga/privkey.pem');
const cert = fs.readFileSync('/etc/letsencrypt/live/backend.openclass.ga/cert.pem');
const ca = fs.readFileSync('/etc/letsencrypt/live/backend.openclass.ga/chain.pem');
const credentials = {key: key, cert:cert, ca:ca }
*/

// Passport Config
app.use(logger('dev'));
require('./config/passport')(passport);
// Connect to MongoDB
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER
mongoose.connect('mongodb://106.10.46.89:27017/openclass', {
  user: "openclass",
  pass: "qwe123",
  authSource: "admin",
  useNewUrlParser:true
} ).then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: '1@%24^%$3^*&98&^%$', // 쿠키에 저장할 connect.sid값을 암호화할 키값 입력
  resave: false,                //세션 아이디를 접속할때마다 새롭게 발급하지 않음
  saveUninitialized: false,      //세션 아이디를 실제 사용하기전에는 발급하지 않음
  cookie:{
    maxAge: 1000 * 60 * 60 * 24   //24시간 만기
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  next();
});

//HTTP 접근 제어(cor) 처리
app.use(cors({origins: ["http://localhost:8080", "http://www.openclass.gq", "http://openclass.gq", "https://www.openclass.gq", "https://openclass.gq"]}));

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/prof', require('./routes/professor.js'));
app.use('/stud', require('./routes/student.js'));
app.use('/admin', require('./routes/admin.js'));
const PORT = process.env.PORT || 5000;
/*
서버에서 활성화
httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
});
const IOserver = https.createServer(credentials, app);
IOserver.listen(3000, function() {
    console.log('Socket running on port 3000');
});

module.exports = IOserver;
*/

app.listen(PORT, console.log(`Server running on port ${PORT}`));
module.exports = app;
