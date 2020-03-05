import CandidateTest from '../../models/CandidateTest/candidateTest';
import Profile from '../../models/Profile/profile';
import Remark from '../../models/Remark/remark';
import {encrypt, decrypt, findResource} from '../../utility/encryptor'

import {geopolitical_zone_calculator, gender_calculator} from '../../utility/geopoliticalgrouper'


exports.home = function(req, res) {

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
        res.render('admin/index', {layout: "layouts/admin/home", data:{all_candidate_geozone:all_candidate_geozone, shortlisted:shortlisted, shortlisted_gender:shortlisted_gender, shortlisted_candidate_geozone:shortlisted_candidate_geozone, total_gender:total_gender, male:male, female:female, total:total, north_central:north_central, north_east:north_east, north_west:north_west, south_south:south_south, south_west:south_west, south_east:south_east}})
    })    
})
}
exports.shortlisted = function(req, res) {
    res.render('admin/shortlisted', {layout: "layouts/admin/home"})
}
exports.shortlisted_candidate_detail = function(req, res) {
    res.render('admin/shortlisted_candidate_detail', {layout: "layouts/admin/home"})
}

exports.admin_create_test = function(req, res) {
    res.render('admin/upload_test', {layout: false})
}
/*
 { question: 'Who am I',
  'repeater-group':
   [ { option: 'theoderic' },
     { option: 'ohinoyi' },
     { option: 'holy mountain' } ],
*/ 

exports.admin_create_test_post = function(req, res) {
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

exports.single_candidate_page = function(req, res){
    let candidate_id = req.params.id;
    Profile.findOne({_id:candidate_id}).populate('user').exec(function(err, profile){   
        res.render('admin/single_candidate_page', {layout: "layouts/admin/home", data:{profile:profile}})
    }) 
}

exports.comment_on_candidate = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        let candidate_id = req.params.id;//this is the profile id
        let remark = new Remark()
        remark.message = req.body.message;
        remark.candidate = req.params.candidate_id;
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
}