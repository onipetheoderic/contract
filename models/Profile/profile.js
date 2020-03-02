var mongoose = require('mongoose');
var ProfileSchema = new mongoose.Schema({
    user:[{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
    role_id: String,
    state_of_origin: String,
    gender: String,
    lga: String,
    state_residence: String,
    year_of_graduation: String,
    school_of_study: String,
    photo: String,
    nysc_number: String,
    course_study: String,
    test_score: String,
    marital_status: String,
    religion: String,
    tribe: String,

    
},{
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);