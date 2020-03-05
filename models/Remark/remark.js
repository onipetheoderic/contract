var mongoose = require('mongoose');
var RemarkSchema = new mongoose.Schema({
    candidate:[{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }],
    commenter:[{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
    message:String,
   
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Remark', RemarkSchema);