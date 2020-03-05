import CandidateTest from '../../models/CandidateTest/candidateTest';
import PersonalityTest from '../../config/personality_test.json';
import Profile from '../../models/Profile/profile'
import {encrypt, decrypt, findResource} from '../../utility/encryptor'


exports.candidate_home = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        Profile.findOne({user:decrypted_user_id}).populate('user').exec(function(err, profile){
            let use_of_it_taken = profile.use_of_it_taken?true:false;
            let iq_test_taken = profile.iq_test_taken?true:false;
            let personality_taken = profile.personality_taken;
            let total_test_taken = use_of_it_taken+iq_test_taken+personality_taken
            let profile_completed = profile.profile_completed?{total:100, number:3}:{total:0, number:0}
            const percentage_test = Math.round(100/3*total_test_taken)
            res.render('candidate/home', {layout: "layouts/candidate/home", profile:profile, profile_completed:profile_completed, total_test_taken:total_test_taken, percentage_test:percentage_test})
        })
    }
}
exports.test_success = function(req, res) {
    res.render('candidate/test_success', {layout: false})
}

exports.test_taken = function(req, res) {
    res.render('candidate/test_taken', {layout: false})
}

exports.select_test = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        Profile.findOne({user:decrypted_user_id}, function(err, profile){
            let use_of_it_taken = profile.use_of_it_taken?true:false;
            let iq_test_taken = profile.iq_test_taken?true:false;
            let personality_taken = profile.personality_taken;
            res.render('candidate/select_test', {layout: "layouts/candidate/home", data:{use_of_it_taken:use_of_it_taken, iq_test_taken:iq_test_taken, personality_taken:personality_taken}})
        })    
    }
}


exports.iq_test = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        Profile.findOne({user:decrypted_user_id}, function(err, profile){
            if(profile.iq_test_taken===false){
                CandidateTest.find({category:"iq_test"}, function(err, all_tests){
                    console.log("these are all the test",all_tests)
                    res.render('candidate/quiz', {layout: "layouts/candidate/home", data:{all_tests:all_tests}})
                })
            }
            else {
                res.redirect('/test_taken')
            }
            
        })
       
    }
}
exports.use_of_it = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
    
        Profile.findOne({user:decrypted_user_id}, function(err, profile){
            if(profile.use_of_it_taken===false){
              
                CandidateTest.find({category:"use_of_it"}, function(err, all_tests){
                    console.log("these are all the test IT",all_tests)
                    res.render('candidate/use_of_it', {layout: "layouts/candidate/home", data:{all_tests:all_tests}})
                })
            }
            else {
                res.redirect('/test_taken')
            }
        });
    }
}
exports.personality_test = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
    
        Profile.findOne({user:decrypted_user_id}, function(err, profile){
            if(profile.personality_taken===false){    
                console.log(PersonalityTest)
                res.render('candidate/personality', {layout: "layouts/candidate/home", data:{all_tests:PersonalityTest}})
            }
            else {
                res.redirect('/test_taken')
            }
        })
    }
}
/*
percentage
*/ 
const personality_calculator = (personality_object) => {
    const majorQualities = [
        'creativity', 'introvert', 'extrovert', 'laziness',
        'take_risk', 'kb', 'ct', 'etl', 'radicalism', 'flexibility', 
        'open_minded','sacrifice', 'pg'
    ]
    // console.log(personality_object)
    let creativity=[], introvert=[], extrovert=[], laziness=[], take_risk=[]
    let kb=[], ct=[], etl=[], radicalism=[], flexibility=[], open_minded=[]
    let sacrifice=[], pg=[]
    for(var k in majorQualities){
        for(var i in personality_object){
            // console.log(personality_object[i])
            if(personality_object[i][majorQualities[k]] !=undefined ){

                if(majorQualities[k]==="creativity"){
                    creativity.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="introvert"){
                    introvert.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="extrovert"){
                    extrovert.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="laziness"){
                    laziness.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="take_risk"){
                    take_risk.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="kb"){
                    kb.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="ct"){
                    ct.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="etl"){
                    etl.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="radicalism"){
                    radicalism.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="flexibility"){
                   flexibility.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="open_minded"){
                    open_minded.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="sacrifice"){
                    sacrifice.push(personality_object[i][majorQualities[k]])
                }
                if(majorQualities[k]==="pg"){
                    pg.push(personality_object[i][majorQualities[k]])
                }
               
            }
          
        }
    }
    //lets organise them to object
 
function score_percentage(arr){
    return (arr.reduce(accumulator)/(arr.length*20))*100
}

let overall_behaviour = [
    {"creativity":score_percentage(creativity) },
    {"introvert":score_percentage(introvert)},
    {"extrovert":score_percentage(extrovert) },
    {"laziness":score_percentage(laziness)},
    {"take_risk":score_percentage(take_risk) },
    {"know_boundaries":score_percentage(kb)},
    {"critical_thinking":score_percentage(ct) },
    {"eagerness_to_learn":score_percentage(etl)},
    {"radicalism":score_percentage(radicalism)},
    {"flexibility":score_percentage(flexibility) },
    {"open_minded":score_percentage(open_minded)},
    {"sacrifice":score_percentage(sacrifice) },
    {"personal_growth":score_percentage(pg)},
{"perceverance_and_endurance": (score_percentage(sacrifice)+score_percentage(radicalism)+score_percentage(open_minded)+score_percentage(etl))/4},
{"research_abitlity": (score_percentage(sacrifice)+score_percentage(radicalism)+score_percentage(open_minded)+score_percentage(etl) + score_percentage(creativity)+score_percentage(take_risk)+ score_percentage(flexibility))/6}
]

return overall_behaviour;
}

exports.personality_test_post = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        let questions_answers = req.body;
        let arrayFied = Object.entries(questions_answers);
        const all_scores = [];
        for(var i in arrayFied){
            // console.log(arrayFied[i])
            let question_id = arrayFied[i][0]
            let answer_id = arrayFied[i][1]
            for(var k in PersonalityTest){
                if(parseInt(question_id) === PersonalityTest[k].question_id){

                for(var j in PersonalityTest[k].scores){
                    if(parseInt(answer_id)===PersonalityTest[k].scores[j].id){
                        // console.log("scores",PersonalityTest[k].scores[j])
                        let selected_score = PersonalityTest[k].scores[j]
                        selected_score['question_id'] = parseInt(question_id)
                            all_scores.push(selected_score)
                    }
                        
                }
                }
            }
        }
        // console.log(all_scores)
        let allpersonality = personality_calculator(all_scores)
        console.log("this is th", allpersonality)
        Profile.findOneAndUpdate({ user: decrypted_user_id}, 
            { $set: {personality:allpersonality, personality_taken:true} }, { new: true }, 
            function(err, doc) {
                if(err){
                    console.log("this is the error",err)
                }
                else {
                    res.redirect('/test_success')
                }
            }
        );
    }
    
}

function accumulator(total, num) {
    return total + num;
  }

//  iq_test_score: Number, iq_test_taken: {type:Boolean, default:false},  
//iq_test_shortlisted: {type:Boolean, default:false},
exports.submit_test = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
    
    CandidateTest.find({category:req.params.test_type}).select(["_id", "answer"]).then(resp => {
        console.log("resp", resp)
        const scores = [];
        let test_constant = 100/resp.length
        console.log(test_constant)
        let question_answers_raw = req.body;
        let arrayFied = Object.entries(question_answers_raw);
        for(var i in arrayFied){
            let question_id = arrayFied[i][0]
            let answer_id = arrayFied[i][1]
            for(var k in resp){
                if(question_id==resp[k]._id){
                    console.log("the questions match")
                    if(parseInt(answer_id) === resp[k].answer){
                        console.log("the answeers match")
                        scores.push(test_constant)
                    }
                    else if(parseInt(answer_id) !== resp[k].answer){
                        console.log("ansewrs dont match")
                        scores.push(0)
                    }           
                }
              
            }
        }
        let accumulatedScore = scores.reduce(accumulator)
        console.log("scores in all questions",scores.reduce(accumulator))
        // we edit the candidate profile to include the score on it
        const score_selector = accumulatedScore >= 70 ? true:false
        if(req.params.test_type=="iq_test"){
            Profile.findOneAndUpdate({ user: decrypted_user_id}, 
                { $set: { iq_test_score: accumulatedScore,
                    iq_test_shortlisted: score_selector, iq_test_taken:true} }, { new: true }, 
                function(err, doc) {
                    if(err){
                        console.log("this is the error",err)
                    }
                    else {
                        res.redirect('/test_success')
                    }
                }
            );
        }
        else if(req.params.test_type=="use_of_it")
        Profile.findOneAndUpdate({ user: decrypted_user_id}, 
            { $set: { use_of_it_score: accumulatedScore,
                use_of_it_shortlisted: score_selector, use_of_it_taken:true} }, { new: true }, 
            function(err, doc) {
                if(err){
                    console.log("this is the error",err)
                }
                else {
                    res.redirect('/test_success')
                }
            }
        );
        });
        
    }
}    
/*
  about_yourself: String,
    my_achievements: String,
    work_experience: String,
*/ 
exports.complete_profile = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
    res.render('candidate/complete_profile', {layout: "layouts/candidate/home"})
    }
}

exports.complete_profile_post = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        // console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        let decrypted_user_role = decrypt(req.session.role, req, res)
        Profile.findOneAndUpdate({ user: decrypted_user_id}, 
            { $set: {about_yourself:req.body.about_yourself, 
                best_for_brf:req.body.best_for_brf, work_experience:req.body.work_experience, profile_completed:true} }, { new: true }, 
            function(err, doc) {
                if(err){
                    console.log("this is the error",err)
                }
                else {
                    res.redirect('/candidate_home')
                }
            }
        );
    }
}