exports.candidate_home = function(req, res) {
    res.render('candidate/home', {layout: "layouts/candidate/home"})
}

exports.quiz = function(req, res) {
    res.render('candidate/quiz', {layout: "layouts/candidate/home"})
}