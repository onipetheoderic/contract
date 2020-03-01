exports.home = function(req, res) {
    res.render('admin/index', {layout: "layouts/admin/home"})
}
exports.shortlisted = function(req, res) {
    res.render('admin/shortlisted', {layout: "layouts/admin/home"})
}
exports.shortlisted_candidate_detail = function(req, res) {
    res.render('admin/shortlisted_candidate_detail', {layout: "layouts/admin/home"})
}