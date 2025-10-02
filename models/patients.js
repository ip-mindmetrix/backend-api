const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let assignedMeasureSchema = new Schema({
    measureId: {
        type: Number,
        required:[true,"measureId is required"]
    },
    measureName: {
        type: String,
        required:[true,"measureName is required"]
    },
    measuringCadence: {
        frequencyTimes: {
            type: Number,
            required:[true,"measuringCadence frequencyTimes is required"]
        },
        frequencyUnit: {
            type: String,
            required:[true,"measuringCadence frequencyUnit is required"]
        }
    }    
});

let patientSchema = new Schema({
    patientId: {
        type: Number,
        required:[true,"patientId is required"]
    },
    legacyPatientId: {
        type: String,
        required:[true,"Legacy patientId is required"]
    },    
    patientName: {
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
    status: {
        type: String,
        required:false
    },
    assignedMeasures:[assignedMeasureSchema],
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
    collection: 'patients'
});

module.exports = mongoose.model('patient', patientSchema);