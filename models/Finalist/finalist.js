var mongoose = require('mongoose');
var FinalistSchema = new mongoose.Schema({
    profile: [{//this is the user that created the Finalist
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }]
   
    	
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Finalist', FinalistSchema);
