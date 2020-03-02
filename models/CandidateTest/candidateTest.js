var mongoose = require('mongoose');
var CandidateTestSchema = new mongoose.Schema({
    question: String,
    category: String,//this will be use of IT, aptitude test, etc
    answers: Array,//this will be an array of options and ids
    answer: Number,//this is the answer id in the arrays of answers
    user: [{//this is the user that created the CandidateTest
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
   
    	
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('CandidateTest', CandidateTestSchema);
