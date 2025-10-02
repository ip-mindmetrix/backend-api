const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let measuresSchema = new Schema({
    measureId: {
        type: Number,
        required:[true,"measureId is required"]
    },
    measureName: {
        type: String,
        required:[true,"measure name is required"]
    },
    measureItems: [{
        measureItemId:{
            type: Number,
            required:[true,"measureItemId is required"]
        },
        measureItemName:{
            type: String,
            required:[true,"measureItemName value is required"]
        },
        scale: {
                lowValue: {
                    type: Number,
                    required:[true,"scale low value is required"]
                },
                lowValueText: {
                    type: String,
                    required:[true,"scale lowValueText is required"]
                },
                highValue: {
                    type: Number,
                    required:[true,"scale high value is required"]
                },
                highValueText: {
                    type: String,
                    required:[true,"scale highValueText is required"]
                }, 
                interval: {
                    type: Number,
                    required:[true,"scale interval is required"]
                }                               
            },
            measureItemStatus: {
                type: String,
                required:[true,"measure item status is required"]
            }
    }],
    measureStatus: {
        type: String,
        required:[true,"measure status is required"]
    },    
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
    collection: 'measures'
});

module.exports = mongoose.model('measures', measuresSchema);