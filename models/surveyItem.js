const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let surveyItemSchema = new Schema({
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
    }],
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
    collection: 'surveyItems'
});

module.exports = mongoose.model('surveyItem', surveyItemSchema);