import CandidateTest from '../../models/CandidateTest/candidateTest';
import Profile from '../../models/Profile/profile';
import Remark from '../../models/Remark/remark';
import User from '../../models/User/user';
import Finalist from '../../models/Finalist/finalist';
import Newsletter from '../../models/Newsletter/newsletter';

import Role from '../../models/Role/role';
import Resource from '../../models/Resource/resource';
import RoleToResource from '../../models/RoleToResource/roleToResource';

//Configuration of roles
import config_resources from '../../config/config_resources.json';
import config_roles from '../../config/config_roles.json';
import config_resourse_link from '../../config/config_resourse_link.json';
const nodemailer = require('nodemailer');
import {encrypt, decrypt, findResource} from '../../utility/encryptor'

import {geopolitical_zone_calculator, gender_calculator} from '../../utility/geopoliticalgrouper'
var hash = require('object-hash');
const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5212ca0b445f15",
      pass: "f1404bde9d5b30"
    }
  });

exports.add_to_finalist = function(req, res){
    let finalist_id = req.params.finalist_id;
    Finalist.find({profile:finalist_id}, function(err, finalist){
        console.log("XXXXXX", finalist)
        if(finalist.length===0){
            console.log("its true, its null")
            let finals = new Finalist();
                finals.profile = finalist_id;
                finals.save(function(err, savedFinals){
                    if(err){
                        console.log("*****error during saving",err)
                    }
                    else {
                        res.redirect(`/single_candidate_page/${finalist_id}`)
                    }
                })
           
        }
        else {
            res.redirect(`/single_candidate_page/${finalist_id}`)
        }
    })
   
}
exports.create_new_password_get = function(req, res){
    let email = req.params.email;
    let user_id = req.params.id;
    let createdAt = req.params.date;
    console.log(email, user_id, createdAt)
    res.render('admin/create_new_password', {layout: false, email:email, user_id:user_id, createdAt:createdAt})
}



exports.create_new_password_post = function(req, res){
    const new_password = req.body.password;
    const email = req.body.email;
    const enc_id = req.body.id;
    const createdAt = req.body.createdAt
    User.find({email: req.body.email}, function(err, user){        
        if(user!=null){
            const _id = hash({user_id: user.id})
            const _date = hash({createdAt: user.createdAt})
            if(enc_id==_id && createdAt==_date){
                console.log("the ids and date match")
                User.findByIdAndUpdate(user.id, {password:new_password})
                .exec(function(err, updated_staff){
                    if(err){
                        console.log(err)
                    }else {
                        if(user.role=="4"){
                            res.redirect('/login')
                        }
                        else {
                            res.redirect('/admin_fg_dashboard_brf/login')
                        }
                       
                    }
                })
            }
        }
        else {
            res.render('admin/create_new_password', {layout: false, message:{success:"Email Not found"} })
        }
      
    // User.findByIdAndUpdate(decrypted_user_id, {password:req.body.new_password})
    // .exec(function(err, updated_staff){
    //     if(err){
    //         console.log(err)
    //     }else {
    //         res.redirect('/admin_fg_dashboard_brf/login')
    //     }
    // })
    })
   
}



exports.forgot_password_post = function(req, res){
   
    User.find({email: req.body.email}, function(err, user){
        if(user!=null){
            const _id = hash({user_id: user.id})
            const _date = hash({createdAt: user.createdAt})
            const email = req.body.email;
            const link = `http://localhost:4000/create_new_password/${_id}/${_date}/${email}`
            const message = {
                from: 'brf.com', // Sender address
                to: req.body.email,        // List of recipients
                subject: 'Forgot your password, Click the link', // Subject line
                html: `<h1>Click the Link below to Recover your password</h1><p><a href=${link}> Click here </a></p>`,
            };
            transport.sendMail(message, function(err, info) {
                if (err) {
                  console.log(err)
                } else {
                  console.log(info);
                }
            });
        }
        else {
            res.render('admin/forgot_password', {layout: false, data:{message:"Email does not exist"}})
        }
    })
    // const email = hash({email: req.body.email})
    // console.log(email)
   
    
    console.log("route reached")
}
exports.sudo_page = function(req, res) {   
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "change_default_settings"
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
            User.find({role:"4"}).sort({'createdAt': -1})
            .limit(5)
            .exec(function(err, candidates) { 
            Newsletter.find({}).sort({'createdAt': -1})
            .limit(5)
            .exec(function(err, newsletters) {       
                Role.find({}, function(err, roles){
                    const roles_present = roles.length===0?false:true;
                    Resource.find({}, function(err, resources){
                        res.render('admin/sudo', {layout: "layouts/admin/sudo", 
                        data:{candidates:candidates, resources_count:resources.length, roles_count:roles.length,
                            roles_present:roles_present, newsletters:newsletters}})
                    })
                }) 
            });
            })
        }
        else{
            res.redirect('/error_403')
        }
    })
}
}

exports.manage_roles = function(req, res) {
    let action_type="change_default_settings";
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    Role.find({}, function(err, roles){
        if(roles.length===0){
            console.log("There is no roles created yet, so lets create em")
            for(var i in config_roles){
                // console.log("these are the configs", config_roles[i])
                let role = new Role();
                role.role_id = config_roles[i].role_id;
                role.title = config_roles[i].title;
                role.save(function(err, auth_details){       
                    if(err){
                      console.log(err)
                    } else {                    
                      console.log("successfull")
                    }
                });
            }
            for(var k in config_resources){
                let resource = new Resource();
                resource.title = config_resources[k].title;
                resource.resource_id = config_resources[k].resource_id;
                resource.save(function(err, resource){
                    if(err){
                        console.log(err)
                      } else {                    
                        console.log("successfull")
                      }
                })
            }
            for(var m in config_resourse_link){
                let roleToResource = new RoleToResource();
                roleToResource.resource_id = config_resourse_link[m].resource_id;
                roleToResource.role_id = config_resourse_link[m].role_id;
                roleToResource.role_name = config_resourse_link[m].role_name;
                roleToResource.resource_name = config_resourse_link[m].resource_name;
                roleToResource.save(function(err, roleToResources){
                    
                    if(err){
                        console.log(err)
                      } else {                    
                        console.log("successfull")
                      }
                })
            }
            res.redirect('/admin_fg_dashboard_brf/sudo_page')
        }
        else {
            let all_roles_filtered=[]
            Role.find({}, function(err, all_roles){
                for(var k in all_roles){
                    if(all_roles[k].role_id !="1"){
                        all_roles_filtered.push(all_roles[k])
                    }
                    
                }
                Resource.find({}, function(err, all_resource){
                    RoleToResource.find({})                    
                    .exec(function(err, all_roles_to_resource){
                        let all_super_roles = [];
                        let all_minister = [];
                        let all_commitee_members = [];
                        let candidates = [];
                        let engineers = []
                        for(var i in all_roles_to_resource){
                            if(all_roles_to_resource[i].role_id==="1"){
                                all_super_roles.push(all_roles_to_resource[i])
                            }
                            if(all_roles_to_resource[i].role_id==="2"){
                                all_minister.push(all_roles_to_resource[i])
                            }
                            if(all_roles_to_resource[i].role_id==="3"){
                                all_commitee_members.push(all_roles_to_resource[i])
                            }
                            if(all_roles_to_resource[i].role_id==="4"){
                                candidates.push(all_roles_to_resource[i])
                            }
                            if(all_roles_to_resource[i].role_id==="5"){
                                engineers.push(all_roles_to_resource[i])
                            }
                        }

                        res.render('admin/manage_roles', {layout: "layouts/admin/sudo", 
                        data:{all_roles:all_roles, 
                            roles_count:all_roles.length,
                            all_resource:all_resource,
                            all_roles_filtered: all_roles_filtered,
                            resource_count:all_resource.length,
                            all_super_roles:all_super_roles,
                            all_minister: all_minister,
                            all_commitee_members:all_commitee_members,
                            engineers:engineers,
                            candidates:candidates
                        }})
                    })
                })
            })
            console.log("_______________________route reached")
        }
    })
}
}

exports.home = function(req, res) {    
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type="view_shortlisted_candidate";
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){    
        const isSuperAdmin = decrypted_user_role==="1"?true:false
        Finalist.find({}).populate({path:'profile', populate:{path:'user'}}).exec(function(err, finalist){
            console.log("finalist", finalist)   
            Profile.find({}).populate('user').exec(function(err, profiles){
                Profile.find({registration_shortlisted:true, use_of_it_shortlisted:true,iq_test_shortlisted:true}).populate('user').exec(function(err, shortlisted){
                let all_profiles = profiles;
                let all_candidate_geozone = geopolitical_zone_calculator(all_profiles)
                let shortlisted_candidate_geozone = geopolitical_zone_calculator(shortlisted)
                let gender_calculato = gender_calculator(all_profiles)
                let shortlisted_gender = gender_calculator(shortlisted)
                const {male, female, total_gender} = gender_calculato
                const { north_central, north_east, north_west, south_south, south_west, south_east, total } = all_candidate_geozone;
                console.log(shortlisted)
                res.render('admin/index', {layout: "layouts/admin/home", data:{finalist:finalist, isSuperAdmin:isSuperAdmin, all_candidate_geozone:all_candidate_geozone, shortlisted:shortlisted, shortlisted_gender:shortlisted_gender, shortlisted_candidate_geozone:shortlisted_candidate_geozone, total_gender:total_gender, male:male, female:female, total:total, north_central:north_central, north_east:north_east, north_west:north_west, south_south:south_south, south_west:south_west, south_east:south_east}})
                })    
            })
        })
        }
        else{
            res.redirect('/error_403')
        }
    })
    }
    
}
exports.shortlisted = function(req, res) {
  
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "view_shortlisted_candidate"
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
            Profile.find({registration_shortlisted:true, use_of_it_shortlisted:true,iq_test_shortlisted:true}).populate('user').exec(function(err, shortlisted){
                res.render('admin/shortlisted', {layout: "layouts/admin/home", data:{shortlisted:shortlisted}})
            })
        }
        else{
            res.redirect('/error_403')
        }
    })
    }
}
exports.shortlisted_candidate_detail = function(req, res) {

    let action_type = "make_remark_on_candidate"
    res.render('admin/shortlisted_candidate_detail', {layout: "layouts/admin/home"})
}

exports.admin_create_test = function(req, res) {
    
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "upload_test"
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
            res.render('admin/upload_test', {layout: false})
        }
        else{
            res.redirect('/error_403')
        }
    })
    }
    
}


exports.admin_create_test_post = function(req, res) {
    
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "upload_test"
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
            let options = req.body.options
            let test_type = req.body.test_type
            let questionWithId = [];
            let count = 1
            for(var i in options){
                let obj = options[i]
                obj["id"] = count++
                questionWithId.push(obj)
            }
            let candidateTest = new CandidateTest();
            candidateTest.question = req.body.question;
            candidateTest.category = test_type
            candidateTest.answers = questionWithId
            candidateTest.answer = req.body.answer_index;
            candidateTest.save(function(err, test){
                if(err){
                    console.log(err)
                }
                else {
                    res.redirect('/admin_fg_dashboard_brf/admin_create_test')
                }
            })
        }
        else{
            res.redirect('/error_403')
        }
    })
    }
}



exports.login_post = function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    // let passwordhash = sha512(req.body.password)
    User.findOne({email: email}, function(err, user) {
        if(user == null){
            res.render('admin/login', {layout: false, message:{error: "Email Not Registered"}})
        }
        else if(user.role === "4"){
            res.redirect("/login")//you dont belong here
        }
        else if(user.role ==="3" || user.role === "2" || user.role==="5" || user.role==="1"){
            if (user.password == password){
                console.log('User connected');
                let encId = encrypt(user.id)
                let encRole = encrypt(user.role)
                req.session.user_id = encId;
                req.session.role = encRole;
                res.redirect("/admin_fg_dashboard_brf")
            }else{
                res.render('admin/login', {layout: false, message:{error: "Passwords dont match"}})
            }
        }
    })
    
}

exports.login = function(req, res){
    res.render('admin/login', {layout: false})
}

exports.register_user = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_user";
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
           
            if(!req.session.hasOwnProperty("user_id")){
                // console.log("its working", req.session.user_id)
                res.redirect('/admin_fg_dashboard_brf/login')
            }
            else if(req.session.hasOwnProperty("user_id")){
                res.render('admin/register_user', {layout: false})
            }
        }
        else{
            res.redirect('/error_403')
        }
    })
    }
}



exports.register_super = function(req, res){
    res.render('admin/register_super', {layout: false})
}

exports.forgot_password = function(req, res){
    res.render('admin/forgot_password', {layout: false})
}

exports.change_password_post = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)

        User.findOne({_id:decrypted_user_id}, function(err, user){
            if(user.password === req.body.prev_password){
                User.findByIdAndUpdate(decrypted_user_id, {password:req.body.new_password})
                .exec(function(err, updated_staff){
                    if(err){
                        console.log(err)
                    }else {
                        res.redirect('/admin_fg_dashboard_brf/login')
                    }
                })
            }
            else {
                res.render('admin/change_password', {layout: false, message:{success:"Passwords dont match"}})
            }
        })
    }
}

exports.change_password = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        res.render('admin/change_password', {layout: false})
    }
}
exports.single_candidate_page = function(req, res){
    
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "make_remark_on_candidate";
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){
    
            let candidate_id = req.params.id;
            Profile.findOne({_id:candidate_id}).populate('user').exec(function(err, profile){   
                Remark.find({candidate:candidate_id}).populate('commenter').exec(function(err, comment){   
                    console.log("comments", comment)
                    res.render('admin/single_candidate_page', {layout: "layouts/admin/single", data:{profile:profile, comment:comment}})
                })
            })
        }
        else{
            res.redirect('/error_403')
        }
    })
    }

}


exports.register_user_post = function(req, res) {
    
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "create_a_user";
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){    
        let incoming_file_name = filePlacerAndNamer(req, res, req.files.photo);
        User.findOne({email: req.body.email}, function(err, email_registered){
            if (email_registered==null) { 
                User.findOne({phoneNumber: req.body.email}, function(err, phone_registered){
                    if (phone_registered==null) { 
                        console.log("Phone number not taken")//
                        const user_role = req.body.user_type ==="engineer"?"5":req.body.user_type==="minister"?"2":req.body.user_type==="commitee_members"?"3":false
                        let user = new User();
                        user.email = req.body.email;
                        user.firstName = req.body.first_name;
                        user.lastName = req.body.last_name;
                        user.phoneNumber = req.body.phone_number;
                        user.password = req.body.password;
                        user.role = user_role;
                        user.picture = incoming_file_name;
                        user.save(function(err, user_detail){
                            if(err){
                            console.log("errr",err)
                                res.render('admin/register_user', {layout: false, message:{error: "Error occured during user registration"}})
                            } else {
                                res.redirect('/admin_fg_dashboard_brf/sudo_page')
                            }
                        });
                    }
                    else if(phone_registered !=null){
                        // console.log("Phone number taken")
                        res.render('admin/register_user', {layout: false, message:{error: "Phone Number has already been taken"}})
                    }
                })
            }
            else if(email_registered !=null){
                res.render('admin/register_user', {layout: false, message:{error: "Email has already been taken"}})
            }
     })
    }
    else{
        res.redirect('/error_403')
    }
})
}
}

exports.register_super_post = function(req, res) {
    let incoming_file_name = filePlacerAndNamer(req, res, req.files.photo);
    User.findOne({email: req.body.email}, function(err, email_registered){
        if (email_registered==null) { 
            User.findOne({phoneNumber: req.body.email}, function(err, phone_registered){
                if (phone_registered==null) { 
                    console.log("Phone number not taken")//
                    const user_role = req.body.user_type ==="engineer"?"5":req.body.user_type==="minister"?"2":req.body.user_type==="commitee_members"?"3":false
                    let user = new User();
                    user.email = req.body.email;
                    user.firstName = req.body.first_name;
                    user.lastName = req.body.last_name;
                    user.phoneNumber = req.body.phone_number;
                    user.password = req.body.password;
                    user.role = "1";
                    user.picture = incoming_file_name;
                    user.save(function(err, user_detail){
                        if(err){
                        console.log("errr",err)
                            res.render('admin/register_user', {layout: false, message:{error: "Error occured during user registration"}})
                        } else {
                            res.redirect('/admin_fg_dashboard_brf/login')
                        }
                    });
                }
                else if(phone_registered !=null){
                    // console.log("Phone number taken")
                    res.render('admin/register_user', {layout: false, message:{error: "Phone Number has already been taken"}})
                }
            })
        }
        else if(email_registered !=null){
            res.render('admin/register_user', {layout: false, message:{error: "Email has already been taken"}})
        }
     })
}

exports.error_403 = function(req, res) {
    res.render('admin/error_403', {layout:false})
}

exports.view_permissions = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "view_all_permission";
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){    
        RoleToResource.find({role_id:req.params.id}, function(err, permissions){
            console.log("all", permissions)
            let role_name = permissions[0].role_name.toUpperCase()
            res.render('admin/all_permissions', {layout: "layouts/admin/home", data:{permissions:permissions, role_name:role_name}})
        }) 
    }
    else if(email_registered !=null){
        res.render('admin/register_user', {layout: false, message:{error: "Email has already been taken"}})
    }
 })
}
}
exports.edit_permission = function(req, res){
    console.log('body', req.body)
    if(req.body.status === "checked"){
        RoleToResource.findByIdAndUpdate(req.body.id, {status:true})
        .exec(function(err, updated_staff){
        if(err){
            res.json({"error":true})
        }else {
            res.json({"error":false, data:updated_staff})
        }
        })
    }
    else {
        RoleToResource.findByIdAndUpdate(req.body.id, {status:false})
        .exec(function(err, updated_staff){
        if(err){
            res.json({"error":true})
        }else {
            res.json({"error":false, data:updated_staff})
        }
        })
    }
}

exports.comment_on_candidate = function(req, res){
   
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/admin_fg_dashboard_brf/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let action_type = "make_remark_on_candidate";
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        const getUser = findResource({role_id: decrypted_user_role})
        getUser.then(function(permissions){
        let my_permissions = []
        for(var i in permissions){
            // console.log(permissions[i].resource_name)
            if(permissions[i].status === true){
                my_permissions.push(permissions[i].resource_name)
            }               
        }
        console.log(my_permissions)
        let permission = my_permissions.includes(action_type);           
        if(permission===true){  
        let candidate_id = req.params.id;//this is the profile id
        console.log(candidate_id)
        let remark = new Remark()
        remark.message = req.body.message;
        remark.candidate = candidate_id;
        remark.commenter = decrypted_user_id;
        remark.save(function(err, saved_remark){
            if(err){
                console.log(err)
            }
            else {
                res.redirect('/single_candidate_page/'+candidate_id)
            }
        })
    }
    else{
        res.redirect('/error_403')
    }
})
}
}

exports.logout = function(req, res){
    req.session.destroy();  
     res.redirect('/')                
  
}
  