const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let countersSchema = new Schema({
    seqFor: {
        type: String,
        required:[true,"sequence for is required"]
    },
    seqId: {
        type: Number,
        required:[true,"sequence id is required"]
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
    collection: 'counters'
});

module.exports = mongoose.model('counter', countersSchema);