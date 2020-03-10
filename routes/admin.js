import express from 'express';


import CandidateController from '../controllers/candidate';
import AdminController from '../controllers/admin';
import HomeController from '../controllers/home';

const router = express.Router();



router.route('/admin_fg_dashboard_brf')
    .get(AdminController.home)

router.route('/error_403')
    .get(AdminController.error_403)

router.route('/logout')
    .get(AdminController.logout)



router.route('/admin_fg_dashboard_brf/login')
    .get(AdminController.login)
    .post(AdminController.login_post)

router.route('/admin_fg_dashboard_brf/sudo_page')
    .get(AdminController.sudo_page)

router.route('/admin_fg_dashboard_brf/view_permissions/:id')
    .get(AdminController.view_permissions)

router.route('/edit_permission/:id')
    .post(AdminController.edit_permission)

router.route('/admin_fg_dashboard_brf/manage_roles')
    .get(AdminController.manage_roles)

router.route('/admin_fg_dashboard_brf/register_user')
    .get(AdminController.register_user)
    .post(AdminController.register_user_post)

router.route('/admin_fg_dashboard_brf/register_super')
    .get(AdminController.register_super)
    .post(AdminController.register_super_post)


router.route('/admin_fg_dashboard_brf/change_password')
    .get(AdminController.change_password)
    .post(AdminController.change_password_post)

router.route('/forgot_password')
    .get(AdminController.forgot_password)
    .post(AdminController.forgot_password_post)

router.route('/add_to_finalist/:finalist_id')
    .get(AdminController.add_to_finalist)

router.route('/admin_fg_dashboard_brf/shortlisted_candidate')
    .get(AdminController.shortlisted)

router.route('/create_new_password/:id/:date/:email')
    .get(AdminController.create_new_password_get)

router.route('/create_new_password_post')
    .post(AdminController.create_new_password_post)

router.route('/admin_fg_dashboard_brf/shortlisted_candidate_detail')
    .get(AdminController.shortlisted_candidate_detail)

router.route('/admin_fg_dashboard_brf/admin_create_test')
    .get(AdminController.admin_create_test)
    .post(AdminController.admin_create_test_post)

router.route('/single_candidate_page/:id')
    .get(AdminController.single_candidate_page)

router.route('/comment_on_candidate/:id')
    .post(AdminController.comment_on_candidate)

router.route('/')
    .get(HomeController.home)
router.route('/departments')
    .get(HomeController.departments)
router.route('/login')
    .get(HomeController.login)

router.route('/register')
    .get(HomeController.login_register)
    .post(HomeController.register_post)

router.route('/about')
    .get(HomeController.about)

router.route('/change_password')
    .get(CandidateController.change_password_get)
    .post(CandidateController.change_password_post)

router.route('/candidate_home')
    .get(CandidateController.candidate_home)

router.route('/newsletter_post')
    .post(HomeController.newsletter_post)

router.route('/candidate_login')
    .post(HomeController.candidate_login)

router.route('/select_test')
    .get(CandidateController.select_test)

router.route('/test_success')
    .get(CandidateController.test_success)

router.route('/test_taken')
    .get(CandidateController.test_taken)

router.route('/iq_test')
    .get(CandidateController.iq_test)

router.route('/use_of_it')
    .get(CandidateController.use_of_it)

router.route('/complete_profile')
    .get(CandidateController.complete_profile)
    .post(CandidateController.complete_profile_post)

router.route('/personality')
    .get(CandidateController.personality_test)
    .post(CandidateController.personality_test_post)

router.route('/submit_test/:test_type')
    .post(CandidateController.submit_test)

export default router;