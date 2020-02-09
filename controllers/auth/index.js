import User from '../../models/User/user';
import Consultant from '../../models/Consultant/consultant';
import {encrypt, decrypt} from '../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../utility/redirector'
const fs = require("fs");
import sha512 from 'sha512';
const cryptoRandomString = require('crypto-random-string');
var randomstring = require("randomstring");
var md5 = require('md5');
// TypeError: (0 , _index.AlexanderTheGreat) is not a function



const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

const dashboardMsg = (type, msg) => {
    if(type=="error"){
        return 
    }
    else {
        return
    }
}

exports.register_user = function(req, res) {
    res.render('Admin/dashboard/register_user', {layout: "layout/admin"})
}

exports.create_highway_inspector = function(req, res) {
    res.render('Admin/dashboard/create_contractor', {layout: "layout/admin"})
}
exports.create_consultant= function(req, res) {
    res.render('Admin/dashboard/create_consultant', {layout: "layout/admin"})
}

exports.assign_highway_contracts = function(req, res){
    res.render('Admin/dashboard/create_consultant', {layout: "layout/admin"})
}

exports.assign_highway_contracts_post = function(req, res){
    res.render('Admin/dashboard/create_consultant', {layout: "layout/admin"})
}

exports.view_all_contractors = function(req, res) {
    Contractor.find({}).exec(function(err, all_records){
        
        res.render('Admin/dashboard/view_all_contractors', {layout:false, datas:{contractors:all_records}})
    })
}

/*
{ "_id" : ObjectId("5e3ba08c00de2926bceab349"), "role" : [ 1, 2, 3 ], 
"companyName" : "Beverly Corp", 
"companyAddress" : "Beverly Corp", 
companyPhoneNumber" : "3105559848", 
companyEmail" : "bhills_9848@mailinator.com", "gender" : "male", "fullName" : "Hills", "createdAt" : ISODate("2020-02-06T05:13:48.438Z"),
 "updatedAt" : ISODate("2020-02-06T05:13:48.438Z"), "__v" : 0 }   })
}
*/ 
exports.create_contractor= function(req, res) {
    res.render('Admin/dashboard/create_contractor', {layout: "layout/stepper"})
}


exports.login = function(req, res) {
    res.render('Admin/dashboard/login', {layout: "layout/admin"})
}




exports.login_post = function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    // let passwordhash = sha512(req.body.password)
    User.findOne({email: email}, function(err, user) {
       if(user == null)
        {
           res.render('Admin/dashboard/login', {layout: false, message:{error: "Email not registered"}})
        }
        else{
            let user_id = user.id
            if (user.password == password){
                  // console.log('User connected');
                  let encId = encrypt(user_id)
                  req.session.user_id = encId;
                  res.redirect("/")
                  // console.log("from session",req.session);
                //   if(user.isAdmin!=true){
                //     res.redirect('/admin')
                //   }
                //   else {
                //     res.redirect('/admin')
                //   }
                  
            }else{
                  // res.status(401).send('Invalid Password Key');
                  res.render('Admin/dashboard/login', {layout: false, message:{error: "invalid Phone Number or password"}})
            }
        }

    })
}


exports.logout = function(req, res){
  req.session.destroy();  
   res.redirect('/')                

}



exports.create_consultant_post = function(req, res) {
    console.log("contractor body",req.body)
 
    var consultant = new Consultant({ 
        companyName: req.body.companyName, 
        companyAddress: req.body.companyAddress,
        companyPhoneNumber: req.body.companyPhoneNumber, 
        companyEmail: req.body.companyEmail,
        gender: req.body.gender, 
        fullName: req.body.fullName,       
     });
     consultant.save(function (err, consultant) {
        if (err) return console.error(err);
        res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "Consultant Successfully Created", successDescription: "The Contractor Was successfully Created"} })
      });
} 



exports.create_contractor_post = function(req, res) {
    console.log("contractor body",req.body)
 
    var contractor = new Contractor({ 
        companyName: req.body.companyName, 
        companyAddress: req.body.companyAddress,
        companyPhoneNumber: req.body.companyPhoneNumber, 
        companyEmail: req.body.companyEmail,
        gender: req.body.gender, 
        fullName: req.body.fullName,       
     });
     contractor.save(function (err, contractor) {
        if (err) return console.error(err);
        res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "Contractor Successfully Created", successDescription: "The Contractor Was successfully Created"} })
      });
} 

exports.register_post = function(req, res) {
    console.log("registerpost url", req.body)    
    const randomPassword = randomstring.generate(7);
    console.log("this is the random password",randomPassword)
    User.findOne({email: req.body.email}, function(err, vals){
        if (vals==null) { 
            console.log("username not taken")
            User.findOne({email: req.body.email}, function(err, valss){
                if (valss==null) { 
                    console.log("Phone number not taken")//
            // var passwordhash = sha512(randomPassword)
            // const passwordhash = md5(passwordhash)
            let user = new User();
                user.email = req.body.email;
                user.firstName = req.body.first_name;
                user.lastName = req.body.last_name;
                user.password = randomPassword;
                user.userType = req.body.user_type;
                user.isAdmin = false;   
                user.phoneNumber = req.body.phone_number;     
                user.save(function(err, auth_details){       
                    if(err){
                        res.render('Admin/dashboard/register_user', {layout: "layout/admin", message:{error: "Error occured during user registration"} })
                        return;
                    } else {                    
                        res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "User Successfully Registered", successDescription: `The Username is ${req.body.email}, while the Password is ${randomPassword}`} })
                    }
                });


        }
        else if(valss !=null){
              // console.log("Phone number taken")
            res.render('Admin/dashboard/register_user', {layout: false, message:{error: "Phone Number has already been taken"} })

        }

        else if(vals !=null){            
            // console.log("username taken")
            res.render('Admin/dashboard/register_user', {layout: false, message:{error: "Email has already been taken"} })
            }
        })
        }
     })   

}



