import Contractor from '../../models/Contractor/contractor';
import Contract from '../../models/Contract/contract';
import {encrypt, decrypt} from '../../utility/encryptor'

exports.get_all_contracts = function(req, res) {
    Contract.find({}, function(err, users) {
        console.log(users)
        res.json(users)
    });
}

exports.user_contracts = function(req, res) {
    Contract.find({highwayInspectorId: req.params.id}, function(err, contracts){
        console.log("this are the list of contracts belonging",contracts)
        res.json(contracts)
    })
}

exports.assign_highway_to_contract = function(req, res) {
    console.log("this is the current id the project want to be assigned to", req.body)
    let highwayId = req.body.user_id;
    let contractId = req.body.contract_id;

    Contract.findOneAndUpdate({ _id: contractId }, { $set: { highwayInspectorId: highwayId,
        assigned: true } }, { new: true }, 
        function(err, doc) {
            if(err){
                res.json({status:"error", data:err})
            }
            else {
                console.log("updated val", doc)
                res.json({status:"success", data:doc})
            }
        }
    );
    

    // Contract.updateOne({ _id: contractId }, { 
    //     highwayInspectorId: highwayId,
    //     assigned: true }, { new: true }).exec(function(err, updated_result){
    //     if(err) {
    //         console.log(err)
    //         res.json({status:"error", data:err})
           
    //     } else {
    //         console.log(updated_result)
    //         res.json({status:"success", data:updated_result})
    //     }
    //     });
        
    // Contract.findByIdAndUpdate(contractId,
    //     {
    //         "highwayInspectorId": highwayId,
    //         "assigned": true
    //     }).exec(function(err, updated_result){
    // if(err) {
    //     console.log(err)
    //     res.json({status:"error", data:err})
       
    // } else {
    //     console.log(updated_result) 
    //     res.json({status:"success", data:updated_result})
    // }
    // });
    
  
}

exports.modify_percentage_of_contract = function(req, res) {
    console.log("this is the current id the project want to be modified to", req.params.id)
    // Contract.findOne({req.body}, function(err, contract){
    //     console.log("singleContract")
    // })
    console.log(req.body)
}

exports.modify_percentage_of_highway_contract = function(req, res) {
    console.log("this is the current id the project want to be assigned to", req.body)
    let currentPercent = req.body.percentage;
    let contractId = req.body.contract_id;

    Contract.findOneAndUpdate({ _id: contractId }, { $set: { currentPercentage: currentPercent} }, { new: true }, 
        function(err, doc) {
            if(err){
                res.json({status:"error", data:err})
            }
            else {
                console.log("updated val", doc)
                res.json({status:"success", data:doc})
            }
        }
    );
}



exports.make_contract_priority = function(req, res) {

}

exports.update_contract_payment = function(req, res) {
    let currentId = req.params.id;
    let amount = req.body.amount;
    let contract_id = req.body.contract_id
    console.log(currentId, amount, contract_id)
}