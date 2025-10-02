const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let assignedSurveyItemSchema = new Schema({
    itemId: {
        type: Number,
        required:[true,"itemId is required"]
    },
    item: {
        type: String,
        required:[true,"item is required"]
    },
    rateCategoriesList: [{
        category:{
            type: String,
            required:[true,"category is required"]
        },
        categoryLow:{
            type: String,
            required:[true,"category low value is required"]
        },
        categoryHigh:{
            type: String,
            required:[true,"category high value is required"]
        },
        scaleRange:{
            type: String,
            required:false
        }        
    }]
}, {
    timestamps:true
});

let postedSurveyItemResultsSchema = new Schema({
    itemId: {
        type: Number,
        required:[true,"itemId is required"]
    },
    item: {
        type: String,
        required:[true,"item is required"]
    },
    rateCategoriesList: [{
        category:{
            type: String,
            required:[true,"category is required"]
        },
        categoryLow:{
            type: String,
            required:[true,"category low value is required"]
        },
        categoryHigh:{
            type: String,
            required:[true,"category high value is required"]
        },
        scaleRange:{
            type: String,
            required:false
        },
        responseScore: {
            type: Number,
            required:false
        },
        responseMessage: {
            type: String,
            required:false
        },
        comments: {
            type: String,
            required:false
        }        
    }],
    postedTime:{
        type: Date, 
        default: Date.now,
        required: true
    }
}, {
    timestamps:true
});

let customerSchema = new Schema({
    customerId: {
        type: Number,
        required:[true,"customerId is required"]
    },
    preferredCustomerId: {
        type: String,
        required:[true,"Preferred customerId is required"]
    },    
    customerName: {
        firstName: {
            type: String,
            required:false
        },
        lastName: {
            type: String,
            required:false
        }    
    },  
    emailId: {
        type: String,
        required:false
    },
    assignedSurveyItems:[assignedSurveyItemSchema],
    postedSurveyItemResults:[postedSurveyItemResultsSchema],
    createdBy: {
        type: String,
        required:false
    },
    updatedBy: {
        type: String,
        required:false
    }
}, {
    timestamps:true,
    collection: 'customers'
});

module.exports = mongoose.model('customer', customerSchema);