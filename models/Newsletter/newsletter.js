var mongoose = require('mongoose');
var NewsletterSchema = new mongoose.Schema({
    email: String,   
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);
