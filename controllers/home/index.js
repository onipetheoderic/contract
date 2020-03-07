import User from '../../models/User/user';
import Profile from '../../models/Profile/profile';
import {encrypt, decrypt, findResource} from '../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../utility/redirector'
import moment from 'moment';
import {geopolitical_zone_calculator, gender_calculator} from '../../utility/geopoliticalgrouper'

exports.home = function(req, res) {
    Profile.find({}).populate('user').exec(function(err, profiles){      
        let all_profiles = profiles;
        let all_candidate_geozone = geopolitical_zone_calculator(all_profiles)       
        let gender_calculato = gender_calculator(all_profiles)       
        const {male, female, total_gender} = gender_calculato
        const { north_central, north_east, north_west, south_south, south_west, south_east, total } = all_candidate_geozone;
      
        res.render('home/index', {layout: "layouts/home/home", data:{all_candidate_geozone:all_candidate_geozone, total_gender:total_gender, male:male, female:female, total:total, north_central:north_central, north_east:north_east, north_west:north_west, south_south:south_south, south_west:south_west, south_east:south_east}})
    })    
   
}

exports.login_register = function(req, res) {
    res.render('home/login-register', {layout: "layouts/home/home"})
}
exports.login = function(req, res) {
    res.render('home/login', {layout: "layouts/home/home"})
}

const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

/* 2017-01-31 1998-01-31*/



const geopolitical_zone_grouper = (state) => {
    let _northCentral = ["Niger", "Benue", "Nassarawa", "Plateau", "Kogi", "Kwara", "FCT"];
    let _northWest = ["Jigawa", "Kano", "Katsina", "Kaduna", "Kebbi", "Zamfara", "Sokoto"];
    let _northEast = ["Gombe", "Bauchi", "Yobe", "Borno", "Adamawa", "Taraba"];
    let _southSouth = ["Akwa-Ibom", "Cross River", "Bayelsa", "Rivers", "Delta", "Edo"];
    let _southEast = ["Abia", "Imo", "Ebonyi", "Enugu", "Anambara"];
    let _southWest = ["Ekiti", "Ondo", "Osun", "Oyo", "Ogun", "Lagos" ];

    if(_northCentral.includes(state)){
        return "north_central"
    }
    else if(_northWest.includes(state)){
        return "north_west"
    }
    else if(_northEast.includes(state)){
        return "north_east"
    }
    else if(_southSouth.includes(state)){
        return "south_south"
    }
    else if(_southEast.includes(state)){
        return "south_east"
    }
    else if(_southWest.includes(state)){
        return "south_west"
    }
}
function dateTimeFormatter(initial_date, todays_date){    
    var a = moment(initial_date,'YYYY-MM-DD');
    var b = moment(todays_date,'YYYY-MM-DD');
    var diffYears = b.diff(a, 'years');
    return diffYears
}

const registration_shortlisted_verifier = (pop_year, age) => {
    if(parseInt(pop_year)<=4 && age<=26){
        return true
    }
    else return false
}


exports.register_post = function(req, res) {
    let incoming_file_name = filePlacerAndNamer(req, res, req.files.photo);
    let dog = req.body.dog;
    let dob = req.body.dob;
    var today = new Date();
    var date = today.toISOString().split('T')[0]
    console.log(dog, dob, date)
    let years_of_pop = dateTimeFormatter(dog, date)
    let age = dateTimeFormatter(dob, date)
    //registration_shortlisted

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
                    user.gender = req.body.gender;
                    user.role = "4";                
                    user.phoneNumber = req.body.phone_number;     
                    user.save(function(err, user_detail){       
                        if(err){
                        console.log("errr",err)
                            res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Error occured during user registration"}})
                        } else {
                            /* geopolitical_zone */ 
                            let profile = new Profile();
                             profile.dob = req.body.dob;
                             profile.dog = req.body.dog;
                            profile.user = user_detail._id;
                            profile.home_address = req.body.home_address;
                            profile.grade_of_school = req.body.grade_of_school;
                            profile.role_id = "4";                           
                            profile.state_of_origin = req.body.state;
                            profile.geopolitical_zone = geopolitical_zone_grouper(req.body.state)
                            profile.state_residence = req.body.state_residence;
                            profile.lga = req.body.lga;
                            profile.school_of_study = req.body.school_of_study
                            profile.photo = incoming_file_name;
                            profile.registration_shortlisted = registration_shortlisted_verifier(years_of_pop, age);
                            profile.course_study = req.body.course;
                            profile.nysc_number = req.body.nysc_number;
                            profile.save(function(err, profile_details){
                                if(err){
                                    console.log(err)
                                    res.render('home/login-register', {layout: "layouts/home/home", message:{error:"server error"}})
                                }
                                else {
                                    res.render('home/login', {layout: "layouts/home/home", message:{success:"Registration successful, Login to your profile"}})
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
exports.departments = function(req, res){
    res.render('home/departments', {layout: "layouts/home/home"})
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

