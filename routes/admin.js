import express from 'express';


import AdminDashboardController from '../controllers/dashboard/admin'
import ContractController from '../controllers/contract/contract';
import AuthDashboard from '../controllers/auth';

const router = express.Router();



router.route('/')
    .get(AdminDashboardController.home)
router.route('/app2')
    .get(AdminDashboardController.home)
router.route('/login')
    .get(AuthDashboard.login)
    .post(AuthDashboard.login_post)
router.route('/register')
    .get(AdminDashboardController.register)
router.route('/view_all_contract')
    .get(AdminDashboardController.view_all_contract)
router.route('/highway_inspection')
    .get(AdminDashboardController.inspection_page)
router.route('/mapview')
    .get(AdminDashboardController.mapview)
router.route('/chart_page')
    .get(AdminDashboardController.chart_page)
router.route('/report_page')
    .get(AdminDashboardController.report_page)
router.route('/create_contract')
    .get(AdminDashboardController.create_contract)
    .post(AdminDashboardController.create_contract_post)
router.route('/register_user')
    .get(AuthDashboard.register_user)
    .post(AuthDashboard.register_post)

router.route('/create_contractor')
    .get(AuthDashboard.create_contractor)
    .post(AuthDashboard.create_contractor_post)

router.route('/view_all_contractors')
    .get(AuthDashboard.view_all_contractors)

router.route('/create_consultant')
    .get(AuthDashboard.create_consultant)
    .post(AuthDashboard.create_consultant_post)

router.route('/all_contracts')
    .get(ContractController.get_all_contracts)

router.route('/edit_user_details')
    .get(AuthDashboard.edit_user_details)

router.route('/assign_highway_to_contract')
    .post(ContractController.assign_highway_to_contract)

router.route('/modify_percentage_of_highway_contract')
    .post(ContractController.modify_percentage_of_highway_contract)

router.route('/single_contract_page/:id')
    .get(AdminDashboardController.get_single_contract)

router.route('/user_contract/:id')
    .get(ContractController.user_contracts)

router.route('/update_contract_payment/:id')
    .post(ContractController.update_contract_payment)

router.route('/make_payment_contract/:id')
    .post(ContractController.make_payment_contract)

router.route('/make_contract_priority/:id')
    .post(ContractController.make_contract_priority)
//all_inspections //inspection_page

export default router;