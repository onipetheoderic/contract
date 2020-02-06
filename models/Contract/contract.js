var mongoose = require('mongoose');
var ContractSchema = new mongoose.Schema({
    serialNo: String,
    contractNo: String,
    projectTitle: String,
    state: String,
    lga: String,
    zone: String,
    mtb: String,
    bpp: String,
    contractSum: String,
    contractType: String,
    roadLength: String,
    bridgeLength:String,
    projectLength: String,
    dateAwarded: String,
    dateCommencement:String,
    dateCompletion: String,
    extendedDateOfCompletion: String,
    appropriationAct: String,
    amountCertifiedToDate:String,
    amountPaidToDate:String,
    outStandingCostPayment:String,
    amountOfOutstandingCost:String,
    role: {type: Array, default: [1,2,3]},
    contractor: String,
    consultant: String,
    // contractor: [{//this is the user that created the Contract
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Contractor'
    //   }],
    // consultant: [{//this is the user that created the Contract
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Consultant'
    // }],
    // user: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
   
    	
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Contract', ContractSchema);
