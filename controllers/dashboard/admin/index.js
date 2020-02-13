import {encrypt, decrypt, BASEURL} from '../../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../../utility/redirector'
const fs = require("fs");
import Contract from '../../../models/Contract/contract';
import User from '../../../models/User/user';
import Contractor from '../../../models/Contractor/contractor';
import Priority from '../../../models/Priority/priority';
const state = require('../../../models/state.json');

import moment from 'moment';


import Consultant from '../../../models/Consultant/consultant';
import AmountPaid from '../../../models/AmountPaid/amountPaid';
import AmountCertified from '../../../models/AmountCertified/amountCertified';
var Request = require("request");
// TypeError: (0 , _index.AlexanderTheGreat) is not a function



const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

const get_diff_start_current_date = (dateAwarded, dateCompletion) => {
    var a = moment(dateAwarded,'YYYY/M/D');
	var b = moment(dateCompletion,'YYYY/M/D');
    var duration = b.diff(a, 'days');
    return duration
}

const get_days_elapsed = (dateAwarded) =>{
    let new_date = new Date()
    let days_elapsed = moment(dateAwarded, 'YYYY/M/D')
    var today = moment(new_date,'M/D/YYYY')
    var duration = today.diff(days_elapsed, 'days');
    return duration
}

function add(accumulator, a) {
    return parseInt(accumulator) + parseInt(a);
}



exports.home = function(req, res) {
    
    Contractor.find({}).exec(function(err, all_contractor){
        User.find({}).exec(function(err, all_user){     
            Contract.find({prioritize:true}, function(err, prioritizedContracts){

           
            Contract.find({})
            .populate('contractor')
            .populate('consultant')
            .exec(function(err, all_contract){
                console.log('%j', all_contract);
                console.log(all_contract.contractor)

                for(var i in all_contract){
                    console.log("this are all the contracts",all_contract[i])
                  
                    const total_duration = get_diff_start_current_date(all_contract[i].dateAwarded, all_contract[i].dateCompletion)
                    console.log(total_duration)
                    const days_elapsed = get_days_elapsed(all_contract[i].dateAwarded)
                    
                    
                    const moneyPaidSoFar = all_contract[i].amount_paid.reduce(add,0)
                    const contractSum = all_contract[i].contractSum;
                    const dailyBudget = contractSum/total_duration;
                    const total_money_supposed_to_be_spent = dailyBudget*days_elapsed;
                    
                    //let calculate internal Default now
                    const internal_default_strict = total_money_supposed_to_be_spent > moneyPaidSoFar?true:false
                    const internal_default_const = total_money_supposed_to_be_spent - moneyPaidSoFar;
                    const internal_default_calc = internal_default_const*100/total_money_supposed_to_be_spent
                    const internal_default = internal_default_calc>70?true:false
                    console.log("this is the elapsed day",days_elapsed)
                    let supposed_percentage = days_elapsed/total_duration*100
                    let contractors_default = all_contract[i].currentPercentage < supposed_percentage-5
                    let obj = all_contract[i];
                    obj["default"] = contractors_default;
                    obj["internal_default"] = internal_default;
                    console.log("default status",obj.default)
                }
                console.log("all prioriti", prioritizedContracts)

               
                res.render('Admin/dashboard/index', {layout: "layout/admin", 
                defaults_count: prioritizedContracts.length,
                priority:prioritizedContracts,
                datas:{
                    BASEURL:BASEURL,
                    prioritizedContracts: prioritizedContracts,
                    contract_count:all_contract.length,
                    user_count:all_user.length,
                    all_contract: all_contract,
                    contractor_count:all_contractor.length}
                })
            })
        })  
        })
    })
     
}


exports.get_single_contract = function(req, res) {
    const myUrl =` ${BASEURL}/get_contract_datas/${req.params.id}`
    Contract.findOne({_id:req.params.id}).exec(function(err, single_contract){
        const total_duration = get_diff_start_current_date(single_contract.dateAwarded, single_contract.dateCompletion)
        const days_elapsed = get_days_elapsed(single_contract.dateAwarded)
        console.log("jjjfjfj",total_duration, days_elapsed)
        let supposed_percentage = days_elapsed/total_duration*100
        let contractors_default = single_contract.currentPercentage < supposed_percentage-5
        let obj = single_contract;
       
        obj["default"] = contractors_default;
        console.log(single_contract.default)

        const moneyPaidSoFar = single_contract.amount_paid.reduce(add,0)
        const contractSum = single_contract.contractSum;
        const dailyBudget = contractSum/total_duration;
        const total_money_supposed_to_be_spent = dailyBudget*days_elapsed;
        
        //let calculate internal Default now
        const internal_default_strict = total_money_supposed_to_be_spent > moneyPaidSoFar?true:false
        const internal_default_const = total_money_supposed_to_be_spent - moneyPaidSoFar;
        const internal_default_calc = internal_default_const*100/total_money_supposed_to_be_spent
        const internal_default = internal_default_calc>70?true:false

        console.log("this is the elapsed day",days_elapsed)
        obj["internal_default"] = internal_default;

        Request.get({url: myUrl}, (error, response, body) => {
            if(error || body=="null") {
                res.render('Admin/dashboard/single_contract_page', {layout:false, data:single_contract, name:"null"})
            }
            else {
                console.log('this is thte body of the request', JSON.parse(body))
                // console.log(JSON.parse(body));
                let databody = body
                res.render('Admin/dashboard/single_contract_page', {layout:false, 
                    data:single_contract, 
                    name:databody, 
                    supposed_percentage: supposed_percentage,
                    
                    moneyPaidSoFar:moneyPaidSoFar,
                    dailyBudget: dailyBudget,
                    total_money_supposed_to_be_spent: total_money_supposed_to_be_spent,
                    

                })
    
            }
           
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
        res.render('Admin/dashboard/view_all_contracts', {layout:false, datas:{contracts:all_records}})
    })
}


exports.inspection_page = function(req, res) {
    res.render('Admin/dashboard/inspection_page', {layout: "layout/admin"})
}
exports.create_contract= function(req, res) {
    Contractor.find({}, function(err, contractors){
        console.log("this are the contr",contractors)
        Consultant.find({}, function(err, consultants){
            console.log("this is the state", state)
            res.render('Admin/dashboard/create_contract', {layout: "layout/stepper", data:{state:state, consultants:consultants, contractors:contractors}})
        })
       
    })
    
}



exports.create_contract_post = function(req, res) {
   console.log("contract body",req.body)

   var contract = new Contract({ 
       projectTitle: req.body.projectTitle, 
       state: req.body.state,
       lga: req.body.lga, 
       zone: req.body.zone,
       contractType: req.body.contract_type,
       mtb: req.body.mtb, 
       bpp: req.body.bpp,
       contractSum: req.body.contractSum, 
       roadLength: req.body.roadLength, 
       bridgeLength: req.body.bridgeLength,
       projectLength: req.body.projectLength, 
       dateAwarded: req.body.dateAwarded,
       dateCommencement: req.body.dateCommencement, 
       consultant: req.body.consultant_id,
       contractor: req.body.contractor_id,
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
