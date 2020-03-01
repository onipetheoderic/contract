var mongoose = require('mongoose');
var ProfileSchema = new mongoose.Schema({
    user:[{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
    role_id: String,
    state: String,
    lga: String,
    institution: String,
    picture: String,
    nysc_number: String,
    course_study: String,
    test_score: String,
    age: String,
    marital_status: String,
    religion: String,
    tribe: String,
    

    
},{
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);