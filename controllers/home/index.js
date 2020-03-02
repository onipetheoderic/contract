import User from '../../models/User/user';
import Profile from '../../models/Profile/profile';
import {encrypt, decrypt, findResource} from '../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../utility/redirector'


exports.home = function(req, res) {
    res.render('home/index', {layout: "layouts/home/home"})
}

exports.login_register = function(req, res) {
    res.render('home/login-register', {layout: "layouts/home/home"})
}
const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}


exports.register_post = function(req, res) {
    console.log("registerpost url", req.body)    
    let incoming_file_name = filePlacerAndNamer(req, res, req.files.photo);
    User.findOne({email: req.body.email}, function(err, email_registered){
        if (email_registered==null) { 
            User.findOne({phoneNumber: req.body.email}, function(err, phone_registered){
                if (phone_registered==null) { 
                    console.log("Phone number not taken")//
                    let user = new User();
                    user.email = req.body.email;
                    user.firstName = req.body.first_name;
                    user.lastName = req.body.last_name;
                    user.middleName = req.body.middle_name;
                    user.phoneNumber = req.body.phone_number;
                    user.password = req.body.password;
                    user.role = "4";                
                    user.phoneNumber = req.body.phone_number;     
                    user.save(function(err, user_detail){       
                        if(err){
                        console.log("errr",err)
                            res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Error occured during user registration"}})
                        } else {
                            let profile = new Profile();
                            profile.user = user_detail._id;
                            profile.role_id = "4";                           
                            profile.state_of_origin = req.body.state;
                            profile.state_residence = req.body.state_residence;
                            profile.lga = req.body.lga;
                            profile.school_of_study = req.body.school_of_study
                            profile.photo = incoming_file_name;
                            profile.course_study = req.body.course;
                            profile.nysc_number = req.body.nysc_number;
                            profile.save(function(err, profile_details){
                                if(err){
                                    
                                    res.render('home/login-register', {layout: "layouts/home/home", message:{error:"server error"}})
                                }
                                else {
                                    res.render('home/login-register', {layout: "layouts/home/home", message:{success:"Registration successful, Login to your profile"}})
                                }
                            })
                           


                        }
                    });
                }
                else if(phone_registered !=null){
                    // console.log("Phone number taken")
                    res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Phone Number has already been taken"}})
                }
            })
        }
        else if(email_registered !=null){            
            res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Email has already been taken"}})
        }
     })
}

exports.candidate_login = function(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        // let passwordhash = sha512(req.body.password)
        User.findOne({email: email}, function(err, user) {
           if(user == null)
            {
                res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Email Not Registered"}})
            }
            else{
                let user_id = user.id
                if (user.password == password){
                    console.log('User connected');
                      let encId = encrypt(user_id)
                      let encRole = encrypt(user.role)
                      req.session.user_id = encId;
                      req.session.role = encRole;
                      res.redirect("/candidate_home")
                }else{
                    res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Passwords dont match"}})
                }
            }
    
        })
        
}
exports.about = function(req, res) {
    res.render('home/about', {layout: "layouts/home/home"})
}

