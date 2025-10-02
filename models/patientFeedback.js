const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackMeasureSchema = new Schema({
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
            patientScore: {
                type: Number,
                required:[true,"patientScore is required"]
            },
            patientScoreText: {
                type: String,
                required:false
            }
        }],
        patientComments: {
            type: String,
            required:false
        },
        patientTotalScore: {
            type: Number,
            required:false
        }
});

let patientFeedbackSchema = new Schema({
    patientFeedbackId: {
        type: Number,
        required:[true,"patientFeedbackId is required"]
    },
    patientId: {
        type: Number,
        required:[true,"patientId is required"]
    },    
    feedbackMeasures: feedbackMeasureSchema,
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
    collection: 'patientFeedback'
});

module.exports = mongoose.model('patientFeedback', patientFeedbackSchema);