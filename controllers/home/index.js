exports.home = function(req, res) {
    res.render('home/index', {layout: "layouts/home/home"})
}

exports.login_register = function(req, res) {
    res.render('home/login-register', {layout: "layouts/home/home"})
}

exports.register_post = function(req, res) {
    console.log("registerpost url", req.body)    
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
                    user.save(function(err, auth_details){       
                        if(err){
                            res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Error occured during user registration"}})
                        } else {                    
                            res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "User Successfully Registered", successDescription: `The Username is ${req.body.email}, while the Password is ${randomPassword}`} })
                        }
                    });
                }
                else if(phone_registered !=null){
                    // console.log("Phone number taken")
                    res.render('Admin/dashboard/register_user', {layout: false, message:{error: "Phone Number has already been taken"} })

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
               res.render('Admin/dashboard/login', {layout: "layout/admin-login", message:{error: "Email not registered"}})
            }
            else{
                let user_id = user.id
                if (user.password == password){
                    console.log('User connected');
                      let encId = encrypt(user_id)
                      let encRole = encrypt(user.role)
                      req.session.user_id = encId;
                      req.session.role = encRole;
                      res.redirect("/")
                }else{
                    res.render('home/login-register', {layout: "layouts/home/home", message:{error: "Invalid Email/password"}})
                }
            }
    
        })
        
}
exports.about = function(req, res) {
    res.render('home/about', {layout: "layouts/home/home"})
}

