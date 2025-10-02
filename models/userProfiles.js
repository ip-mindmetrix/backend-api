const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let userProfileSchema = new Schema({
    userProfileId: {
        type: String,
        required:[true,"userProfileId is required"]
    },                
    userName: {
        type: String,
        required:[true,"userName is required"]
    },  
    password: {
        type: String,
        required:false
    },    
    userType: {
        type: String,
        required:[true,"userType is required"]
    },
    patientId: {
        type: Number,
        required:[true,"patientId is required"]
    },    
    userStatus: {
        type: String,
        required:false
    },            
    lastLogin: {
        type: Date,
        required:false
    },
    registeredAt: {
        type: Date,
        required:false
    },        
    createdBy: {
        type: String,
        required:[true,"createdBy is required"]
    },
    updatedBy: {
        type: String,
        required:false
    }
}, {
    timestamps:true,
    collection: 'userProfiles'
});

// hash the password
userProfileSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
  // checking if password is valid
userProfileSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
module.exports = mongoose.model('userProfiles', userProfileSchema);