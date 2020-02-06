import {encrypt, decrypt} from '../../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../../utility/redirector'
const fs = require("fs");
import Contract from '../../../models/Contract/contract';
import User from '../../../models/User/user';
import Contractor from '../../../models/Contractor/contractor';
import Consultant from '../../../models/Consultant/consultant';

// TypeError: (0 , _index.AlexanderTheGreat) is not a function



const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

exports.home = function(req, res) {
    Contractor.find({}).exec(function(err, all_contractor){
        User.find({}).exec(function(err, all_user){       
            Contract.find({}).exec(function(err, all_contract){
                res.render('Admin/dashboard/index', {layout: "layout/admin", 
                datas:{
                    contract_count:all_contract.length,
                    user_count:all_user.length,
                    all_contract: all_contract,
                    contractor_count:all_contractor.length}
                })
            })
        })
    })
     
}
exports.login = function(req, res) {
    res.render('Admin/dashboard/login-register', {layout: "layout/login-register", })
}
exports.register = function(req, res) {
    res.render('Admin/dashboard/register', {layout: "layout/login-register", })
}

exports.view_all_contract = function(req, res) {
    Contract.find({}).exec(function(err, all_records){
        let allKeys = Object.keys(all_records)
        res.render('Admin/dashboard/view_all_contracts', {layout:false, datas:{contracts:all_records}})
    })
}
exports.inspection_page = function(req, res) {
    res.render('Admin/dashboard/inspection_page', {layout: "layout/admin"})
}
exports.create_contract= function(req, res) {
    res.render('Admin/dashboard/create_contract', {layout: "layout/stepper"})
}



exports.create_contract_post = function(req, res) {
   console.log("contract body",req.body)

   var contract = new Contract({ 
       projectTitle: req.body.projectTitle, 
       state: req.body.state,
       lga: req.body.lga, 
       zone: req.body.zone,
       mtb: req.body.mtb, 
       bpp: req.body.bpp,
       contractSum: req.body.contractSum, 
       contractType: req.body.contractType,

       roadLength: req.body.roadLength, 
       bridgeLength: req.body.bridgeLength,
       projectLength: req.body.projectLength, 
       dateAwarded: req.body.dateAwarded,
       dateCommencement: req.body.dateCommencement, 
       dateCompletion: req.body.dateCompletion,
       extendedDateOfCompletion: req.body.extendedDateOfCompletion, 
       appropriationAct: req.body.appropriationAct,
       amountCertifiedToDate: req.body.amountCertifiedToDate, 
       amountPaidToDate: req.body.amountPaidToDate,
       outStandingCostPayment: req.body.outStandingCostPayment, 
       amountOfOutstandingCost: req.body.amountOfOutstandingCost,

    });
 
    // save model to database
    contract.save(function (err, contract) {
      if (err) return console.error(err);
      res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "Contract Successfully Created", successDescription: "The Contract Was successfully Created"} })
    });
/*
    state: '',
  lga: '',
  zone: '',
  mtb: '',
  bpp: '',
  contractSum: '',
  contractType: '',
  roadLength: '',
  bridgeLength: '',
  projectLength: '',
  dateAwarded: '',
  dateCommencement: '',
  dateCompletion: '',
  extendedDateOfCompletion: '',
  appropriationAct: '',
  amountCertifiedToDate: '',
  amountPaidToDate: '',
  outStandingCostPayment: '',
  amountOfOutstandingCost: ''
*/    
}


exports.mapview = function(req, res) {
    res.render('Admin/dashboard/map_view', {layout: "layout/admin"})
}
exports.chart_page = function(req, res) {
    res.render('Admin/dashboard/chart', {layout: "layout/chatlayout"})
}

exports.report_page = function(req, res) {
    res.render('Admin/dashboard/report', {layout: "layout/form"})
}