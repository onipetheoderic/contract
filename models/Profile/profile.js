var mongoose = require('mongoose');
var ProfileSchema = new mongoose.Schema({
    user:[{//this is the user that created the Contract
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
    role_id: String,
    state_of_origin: String,
    dob: String,
    dog: String,
    gender: String,
    lga: String,
    state_residence: String,
    geopolitical_zone: String,
    year_of_graduation: String,
    school_of_study: String,
    photo: String,

    about_yourself: String,
    best_for_brf: String,
    work_experience: String,
    profile_completed:{type:Boolean, default:false},
    personality: Array,
    iq_test_score: Number,
    use_of_it_score: Number,

    iq_test_taken: {type:Boolean, default:false},
    use_of_it_taken: {type:Boolean, default:false},
    personality_taken: {type:Boolean, default:false},

    registration_shortlisted: {type:Boolean, default:false},
    iq_test_shortlisted: {type:Boolean, default:false},
    use_of_it_shortlisted: {type:Boolean, default:false},
    personality_shortlisted: {type:Boolean, default:false},

    nysc_number: String,
    course_study: String,
    marital_status: String,
    religion: String,
    tribe: String,

    
},{
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);