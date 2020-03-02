import express from 'express';


import CandidateController from '../controllers/candidate';
import AdminController from '../controllers/admin';
import HomeController from '../controllers/home';

const router = express.Router();



router.route('/admin_fg_dashboard_brf')
    .get(AdminController.home)

router.route('/admin_fg_dashboard_brf/shortlisted_candidate')
    .get(AdminController.shortlisted)

router.route('/admin_fg_dashboard_brf/shortlisted_candidate_detail')
    .get(AdminController.shortlisted_candidate_detail)

router.route('/admin_fg_dashboard_brf/admin_create_test')
    .get(AdminController.admin_create_test)
    .post(AdminController.admin_create_test_post)

router.route('/')
    .get(HomeController.home)

router.route('/login')
    .get(HomeController.login_register)

router.route('/register')
    .get(HomeController.login_register)
    .post(HomeController.register_post)

router.route('/about')
    .get(HomeController.about)

router.route('/candidate_home')
    .get(CandidateController.candidate_home)


router.route('/candidate_login')
    .post(HomeController.candidate_login)

router.route('/quiz')
    .get(CandidateController.quiz)

router.route('/submit_test/:test_type')
    .post(CandidateController.submit_test)
// router.route('/login')
//     .get(AuthDashboard.login)
//     .post(AuthDashboard.login_post)

// router.route('/get_all_highway_contracts_by_highway_id/:id')
//     .get(ContractController.get_all_highway_contracts_by_highway_id)

// router.route('/unauthorized')
//     .get(AuthDashboard.unauthorized)

// router.route('/chat')
//     .get(AuthDashboard.chat)

// router.route('/get_contract_datasheet/:id')
//     .get(AdminDashboardController.get_contract_datasheet)
// router.route('/get_contract_percentage/:id')
//     .get(ContractController.get_contract_percentage)

// router.route('/register_super')
//     .get(AdminDashboardController.register)
//     .post(AdminDashboardController.register_super)
// router.route('/logout')
//     .get(AuthDashboard.logout)

// router.route('/change_password')
//     .get(AuthDashboard.changePassword_get)
//     .post(AuthDashboard.changePassword_post)

// router.route('/view_permissions/:id')
//     .get(AdminDashboardController.view_permissions)

// router.route('/view_all_contract')
//     .get(AdminDashboardController.view_all_contract)

// router.route('/edit_permission/:id')
//     .post(AdminDashboardController.edit_permission)

// router.route('/highway_inspection')
//     .get(AdminDashboardController.inspection_page)

// router.route('/mapview')
//     .get(AdminDashboardController.mapview)

// router.route('/chart_page')
//     .get(AdminDashboardController.chart_page)

// router.route('/report_page')
//     .get(AdminDashboardController.report_page)

// router.route('/manage_roles')
//     .get(AdminDashboardController.manage_roles)

// router.route('/create_contract')
//     .get(AdminDashboardController.create_contract)
//     .post(AdminDashboardController.create_contract_post)
// router.route('/register_user')
//     .get(AuthDashboard.register_user)
//     .post(AuthDashboard.register_post)

//     router.route('/change_password')
//     .get(AuthDashboard.changePassword_get)
//     .post(AuthDashboard.changePassword_post)

// router.route('/create_contractor')
//     .get(AuthDashboard.create_contractor)
//     .post(AuthDashboard.create_contractor_post)

// router.route('/view_all_contractors')
//     .get(AuthDashboard.view_all_contractors)

// router.route('/create_consultant')
//     .get(AuthDashboard.create_consultant)
//     .post(AuthDashboard.create_consultant_post)

// router.route('/all_contracts')
//     .get(ContractController.get_all_contracts)

// router.route('/edit_user_details')
//     .get(AuthDashboard.edit_user_details)

// router.route('/assign_highway_to_contract')
//     .post(ContractController.assign_highway_to_contract)

// router.route('/modify_percentage_of_highway_contract')
//     .post(ContractController.modify_percentage_of_highway_contract)

// router.route('/single_contract_page/:id')
//     .get(AdminDashboardController.get_single_contract)

// router.route('/user_contract/:id')
//     .get(ContractController.user_contracts)

// router.route('/update_contract_payment/:id')
//     .post(ContractController.update_contract_payment)

// router.route('/make_payment_contract/:id')
//     .post(ContractController.make_payment_contract)

// router.route('/make_contract_priority/:id')
//     .post(ContractController.make_contract_priority)
//all_inspections //inspection_page

export default router;