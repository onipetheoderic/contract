import CandidateTest from '../../models/CandidateTest/candidateTest';
import { response } from 'express';

exports.candidate_home = function(req, res) {
    res.render('candidate/home', {layout: "layouts/candidate/home"})
}

exports.quiz = function(req, res) {
    CandidateTest.find({}, function(err, all_tests){
        console.log("these are all the test",all_tests)
        res.render('candidate/quiz', {layout: "layouts/candidate/home", data:{all_tests:all_tests}})
    })
    
}
function accumulator(total, num) {
    return total + num;
  }
exports.submit_test = function(req, res) {
    console.log("test type",req.params.test_type)
    // CandidateTest.find({category: req.params.test_type}, function(err, questions_answer))
    
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
    });
}