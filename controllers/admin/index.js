import CandidateTest from '../../models/CandidateTest/candidateTest';

exports.home = function(req, res) {
    res.render('admin/index', {layout: "layouts/admin/home"})
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
    candidateTest.answer = questionWithId[0].id;
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