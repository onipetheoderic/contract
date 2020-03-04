import CandidateTest from '../../models/CandidateTest/candidateTest';
import Profile from '../../models/Profile/profile';
import {geopolitical_zone_calculator, gender_calculator} from '../../utility/geopoliticalgrouper'


exports.home = function(req, res) {
    Profile.find({}).populate('user').exec(function(err, profiles){
        let all_profiles = profiles;
        let all_candidate_geozone = geopolitical_zone_calculator(all_profiles)
        let gender_calculato = gender_calculator(all_profiles)
        const {male, female, total_gender} = gender_calculato
        const { north_central, north_east, north_west, south_south, south_west, south_east, total } = all_candidate_geozone;
        console.log(all_candidate_geozone)
        res.render('admin/index', {layout: "layouts/admin/home", data:{total_gender:total_gender, male:male, female:female, total:total, north_central:north_central, north_east:north_east, north_west:north_west, south_south:south_south, south_west:south_west, south_east:south_east}})
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

/*
question: String,
    category: String,//this will be use of IT, aptitude test, etc
    answers: Array,//this will be an array of options and ids
    answer: Number,//this is the answer id in the arrays of answers
    user: [{//this is the user that created the CandidateTest
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
*/ 