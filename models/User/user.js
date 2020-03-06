var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    email: {type:String, required: true},
    password: { type: String, required: true },
    lastName: String,
    firstName: String,
    gender: String,
   	phoneNumber: String,	
	token: String,
    suspended: String,
    picture: String,//this is for the admin user, dont wanna make extra relation
    role: String,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('User', UserSchema);