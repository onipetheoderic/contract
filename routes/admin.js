import express from 'express';


import AdminDashboardController from '../controllers/dashboard/admin'
import ClientDashboardController from '../controllers/dashboard/client'
import AuthDashboard from '../controllers/auth';

const router = express.Router();

router.route('/client_dashboard')
    .get(ClientDashboardController.home)

router.route('/')
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

//all_inspections //inspection_page

export default router;