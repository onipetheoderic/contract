import express from 'express';
const expressValidator = require('express-validator');
import moment from 'moment';
const path = require("path");
const fs = require("fs");
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import lessMiddleware from 'less-middleware';
import mongoose from 'mongoose';
import hbs from 'hbs';
const fileUpload = require('express-fileupload');


// import home from './routes/home';
import admin from './routes/admin';


const app = express();
app.use(fileUpload());
var debug = require('debug');
var http = require('http').Server(app);
const port = process.env.PORT || '4000';

var io = require('socket.io')(http);

// export locals ato template
hbs.localsAsTemplateData(app);
app.locals.defaultPageTitle = 'Theoderic Boilerplate';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout/main' });

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(session({cookie: { maxAge: 60000 }}));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'AdminBSBMaterialDesign-master')));
app.use('/bower_components', express.static(`${__dirname}/bower_components`));
var session = require('express-session');


app.use(session({
  name: 'contract',
  secret: 'keyboard cat', 
  resave: false,
  saveUninitialized: false,
cookie: {secure:false},
}))

app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available  
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
  });
app.use(express.static(path.join(__dirname, 'views/public')));//this is for the css and js files in the template folder
app.use(express.static(__dirname + '/public/'));

// Express-validator MiddleWare copied from https://github.com/ctavan/express-validator/issues/238
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var   namespace = param.split('.'),
            root      = namespace.shift(),
            formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// app.use('/', home);
app.use('/', admin);

// mongoose.connect('mongodb://localhost/boilerdb');
mongoose.connect('mongodb://localhost/brf').then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

//socket
var new_user = 0
var count = 0;
var $ipsConnected = [];


io.on("connection", socket => {
  var $ipAddress = socket.handshake.address;
  console.log("this is the ip", $ipAddress)
 
  if (!$ipsConnected.includes($ipAddress)) {
  	$ipsConnected.push($ipAddress)
  	count++;
      
   // io.emit("counter",`${count}`);
  }
  console.log("list of ips in array",$ipsConnected)


  socket.emit("unique_count",$ipsConnected.length);

  new_user++
  io.emit("announcement",`${new_user}`);
  socket.broadcast.emit("announcement_text", "a new user joined...");

  socket.on("chat message", msg => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    new_user--
    count--
    io.emit("announcement", `${new_user}`);
    
  });
  
});


//socket end


app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//this is to set a global variable for the user, to know if the user is logged in or not
app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});


// // // error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   console.log(res.locals.message)
//   console.log(res.locals.error)
//   console.log(err)

//   // render the error page
//   res.status(err.status || 500);
//    res.render('errorpage/index', {layout: false, error_code: 404})
//   console.log('error')
// });

// hbs.registerHelper('entries', (data, options) => {
//   console.log("aaaa",data)
//   var ret = "";

//   for (var i = 0, j = data.length; i < j; i++) {
//     ret = ret + options.fn(data[i]);
//   }

//   return ret;
// });

hbs.registerHelper('json', function (content) {
    return JSON.stringify(content);
});

hbs.registerHelper('jsonp', function(cont){
  let content = JSON.parse(JSON.stringify(cont))
  console.log("this iis the content",content)
  if(content[0]!==undefined){
   let companyName = `${content[0].firstName} ${content[0].lastName}`
    return companyName
  }
  else return;
  
})
hbs.registerHelper('pix_getter', function(cont){
  let content = JSON.parse(JSON.stringify(cont))
  console.log("this iis the content",content)
  if(content[0]!==undefined){
   
    return content[0].picture
  }
  else return;
  
})

hbs.registerHelper('ago_time', function(time){
  return moment(time).fromNow();
})

hbs.registerHelper('jsonpp', function(status) {
  let content = JSON.parse(JSON.stringify(cont))
  console.log(content)
});

hbs.registerHelper('finalist_fullname', function(data) {
  // let content = JSON.parse(JSON.stringify(data))
  if(data!=undefined){
    return `${data[0].user[0].firstName} ${data[0].user[0].lastName}`
  }
  else return;
  
});

hbs.registerHelper('finalist_geozone', function(data) {
  // let content = JSON.parse(JSON.stringify(data))
  if(data!=undefined){
    return `${data[0].geopolitical_zone}`
  }
  else return;
  
});
hbs.registerHelper('finalist_state', function(data) {
  // let content = JSON.parse(JSON.stringify(data))
  if(data!=undefined){
    return `${data[0].state_of_origin}`
  }
  else return;
  
});
hbs.registerHelper('finalist_course', function(data) {
  // let content = JSON.parse(JSON.stringify(data))
  if(data!=undefined){
    return `${data[0].course_study}`
  }
  else return;
  
});
hbs.registerHelper('finalist_img', function(data) {
  // let content = JSON.parse(JSON.stringify(data))
  if(data!=undefined){
    return `${data[0].photo}`
  }
  else return;
  
});
hbs.registerHelper('finalist_id', function(data) {
  // let content = JSON.parse(JSON.stringify(data))
  if(data!=undefined){
    return `${data[0]._id}`
  }
  else return;
  
});


hbs.registerHelper('dob_calc', function(dob){
    var today = new Date();
    var todays_date = today.toISOString().split('T')[0]
    var a = moment(dob,'YYYY-MM-DD');
    var b = moment(todays_date,'YYYY-MM-DD');
    var diffYears = b.diff(a, 'years');
    return diffYears
})


hbs.registerHelper('uppercase', function (str) {
  if(str && typeof str === "string") {
    return str.toUpperCase();
  }
  return '';
});

hbs.registerHelper('truncator', function (str) {
  if(str.length>=600) {
    var maxLength = 600 // maximum number of characters to extract

//trim the string to the maximum length
    var trimmedString = str.substr(0, maxLength);

//re-trim if we are in the middle of a word
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    return trimmedString+"...";
  }
  else{
    return str;
  }
});

hbs.registerHelper('mini-truncator', function (str) {
  if(str.length>=10) {
    var maxLength = 10 // maximum number of characters to extract

//trim the string to the maximum length
    var trimmedString = str.substr(0, maxLength);

//re-trim if we are in the middle of a word
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("")))
    return trimmedString+"...";
  }
  else{
    return str;
  }
});

hbs.registerHelper('medium-truncator', function (str) {
  if(str.length>=160) {
    var maxLength = 160 // maximum number of characters to extract

//trim the string to the maximum length
    var trimmedString = str.substr(0, maxLength);

//re-trim if we are in the middle of a word
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("")))
    return trimmedString+"...";
  }
  else{
    return str;
  }
});
hbs.registerHelper('ifEquals', function(arg1, options) {
  if(arg1 <1) {
    return options.fn(this);
  }
  return options.inverse(this);
});


hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 >= v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('compare', function(v1, v2, options) {
  if(v1 >= v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('fives', function(val){
  if(val && val >=5){
    return "✓"
  }
  else{
    return "-"
  }
});


hbs.registerHelper('currency', function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
)


hbs.registerHelper('fours', function(val){
  if(val && val == 4){
    return "✓"
  }
  else{
    return "-"
  }
});
hbs.registerHelper('thress', function(val){
  if(val && val == 3){
    return "✓"
  }
  else{
    return "-"
  }
});
hbs.registerHelper('twos', function(val){
  if(val && val == 2){
    return "✓"
  }
  else{
    return "-"
  }
});
hbs.registerHelper('ones', function(val){
  if(val && val == 1){
    return "✓"
  }
  else{
    return "-"
  }
});



hbs.registerHelper('home_name_splitter', function(game){
  let new_name = game.split(' vs ')
  return new_name[0]
})

hbs.registerHelper('away_name_splitter', function(game){
  let new_name = game.split(' vs ')
  return new_name[1]
})

hbs.registerHelper('approximator', function(num){
 let newNum = num.toFixed(2)
 return newNum
})
hbs.registerHelper('approximator_percentager', function(num){
  let newNum = num.toFixed(1)
  if(newNum>100){
    return 100
  }
  else return newNum
 })


hbs.registerHelper('odds_verifier', function(val, homeGS, homeGC){
  if(homeGC<=12 && val<=2 && homeGS>=homeGC*2){
    return "1"
  }
  else {
    return "1X"
  }
});
hbs.registerHelper('formatDate', function(dateString) {
    if(dateString!=undefined){
      return moment(dateString).format("MMM Do YY"); 
    }
    
});
hbs.registerHelper('checkers', function(status) {
  if(status===true){
    return "checked"
  }
  else {
    return "unchecked"
  }
  
});


hbs.registerHelper('underscore_formatter', function(str){
  if(str!=undefined){
    let new_str = str.toUpperCase();
    return new_str.replace(/_/g, ' ');
  }
  else {
    return str
  }
  
})

hbs.registerHelper('link', function(text, options) {
  var attrs = [];

  for (const prop in options.hash) {
    attrs.push(
    `${hbs.handlebars.escapeExpression(prop)}="` +
    `${hbs.handlebars.escapeExpression(options.hash[prop])}"`);
}

  return new hbs.handlebars.SafeString(
    `<a ${attrs.join(' ')}>${hbs.handlebars.escapeExpression(text)}</a>`
  );
});



http.listen(port, function(err){//this takes a callback, that is if we want to run something when we start listening to the port
  if(err){
    console.log("this is the error")
  }
  console.log("Listening on Port:", port);
 
});

module.exports = app;
