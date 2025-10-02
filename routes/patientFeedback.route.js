// backend/routes/patients.route.js

const express = require('express');
const router = express.Router();
const patientFeedback = require('../models/patientFeedback');
const counter = require('../models/counter');
const patient = require('../models/patients');
const measure = require('../models/measures');
const crypto = require('crypto');


// Test patientFeedback
router.get('/test', async (req, res, next) => {
    try {
        res.send('Hello api/patientFeedback/test')
    } catch (error) {
        return next(error);
    }
});

// CREATE patientFeedback
router.post('/', async (req, res, next) => {    
    try {
        const pt = await patient.findOne(
            {patientId:req.body.patientId}
        );
        if (pt==null){
            let errMsg = "Patient does not exists in system"
            console.log(errMsg);
            res.status(404).json({
                    msg: errMsg,
            });           
        } else {            
                try {
                    const cd = await counter.findOneAndUpdate(
                        {seqFor:"patientFeedback"},
                        {"$inc":{"seqId":1}},
                        {new:true}
                    );
                    let seqId;
                    if (cd==null){
                        const newCounter = new counter({seqFor:"patientFeedback","seqId":401})
                        seqId = 401
                        newCounter.save()
                    } else {            
                        seqId = cd.seqId
                    }
                    try {                    
                        let totalScore = 0
                        req.body.feedbackMeasures['measureItems'].forEach(result =>{
                            totalScore = totalScore + result['patientScore']
                        })
                        req.body.feedbackMeasures['patientTotalScore']= totalScore                
                        const newPatientFeedback = new patientFeedback(
                            {
                                patientFeedbackId:seqId,
                                patientId:req.body.patientId,
                                feedbackMeasures:req.body.feedbackMeasures,
                                createdBy:req.body.createdBy,
                                updatedBy:req.body.updatedBy
                            }
                        )                
                        newPatientFeedback.save()/*
                        const newPatientFeedback = await patientFeedback.updateOne(
                            {patientId:req.body.patientId}, 
                            {$push : {feedbackMeasures: req.body.feedbackMeasures},
                            updatedBy:req.body.updatedBy 
                            },
                            { new: true }
                        );*/
                        console.log(newPatientFeedback);
                        res.json("Patient feedback submitted successfully");
                    } catch (error) {
                        return next(error);
                    }            
                } catch (error) {
                    return next(error);
                }                        
            }
        } catch (error) {
            return next(error);
    }                 
});

// READ all patientFeedbacks
router.get('/All', async (req, res, next) => {
    try {
        const data = await patientFeedback.find();
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// READ Single patientFeedback
router.get('/byLegacyPatientId/:lpid', async (req, res, next) => {
    try {
        const pt = await patient.findOne({legacyPatientId:req.params.lpid});
        if (pt==null){
            let errMsg = "Patient does not exists in system"
            console.log(errMsg);
            res.status(404).json({
                    msg: errMsg,
            });           
        } else {
            try {
                const ptf = await patientFeedback.find({patientId:pt['patientId']});
//                if (ptf==null || ptf.length == 0){
                if (ptf==null){    
                    let errMsg = "No feedback found for this Patient and measure"
                    console.log(errMsg);
                    res.status(404).json({
                            msg: errMsg,
                    });           
                } else {
                    let errMsg = "feedback found for this Patient and measure " + req.params.lpid + ' - ' +pt['patientId']
                    console.log(errMsg);
                    let patientFeedbackLookupResult = {}
                    let measuresWithFeedback = []                    
                    patientFeedbackLookupResult['patientId'] = pt['patientId']
                    patientFeedbackLookupResult['legacyPatientId'] = pt['legacyPatientId'] 
                    patientFeedbackLookupResult['patientName'] = pt['patientName']
                    patientFeedbackLookupResult['emailId'] = pt['emailId']
                    pt['assignedMeasures'].forEach(item =>{
                        let measureWithFeedback = {}
                        measureWithFeedback['measureId'] = item['measureId']
                        measureWithFeedback['measureName'] = item['measureName']
                        measureWithFeedback['measuringCadence'] = item['measuringCadence']['frequencyTimes'] + ' times a ' + item['measuringCadence']['frequencyUnit']                        
                        let feedbackRows = []
                        measureWithFeedback['feedbackRows'] = feedbackRows                        
                        ptf.forEach(patientFeedbackItem =>{
                            //console.log('patientfeedback item ' + patientFeedbackItem['patientFeedbackId'])
                            feedbackItem = patientFeedbackItem['feedbackMeasures']                            
                            if (feedbackItem['measureId'] == item['measureId']) {                                
                                let feedbackHeaderRow  = {}
                                feedbackHeaderRow['Feedback Date'] = 'Feedback Date'
                                feedbackItem['measureItems'].forEach(measureItem =>{ 
                                    feedbackHeaderRow[measureItem['measureItemName']] = measureItem['measureItemName']
                                })
                                feedbackHeaderRow['patientTotalScore'] = 'patientTotalScore'
                                feedbackHeaderRow['patientComments'] = 'patientComments'
                                //if (feedbackRows.length == 0){
                                //    feedbackRows.push(feedbackHeaderRow)
                                //}
                                let feedbackRow  = {}
                                feedbackRow['Feedback Date'] = patientFeedbackItem['createdAt']                                
                                for (const columName of Object.keys(feedbackHeaderRow)) {
                                    feedbackItem['measureItems'].forEach(measureItem =>{
                                        if (columName == measureItem['measureItemName']) {
                                            feedbackRow[columName] = measureItem['patientScore']
                                        }
                                    })                                    
                                };
                                feedbackRow['patientTotalScore'] = feedbackItem['patientTotalScore']
                                feedbackRow['patientComments'] = feedbackItem['patientComments']
                                feedbackRows.push(feedbackRow)
                            }
                            measureWithFeedback['feedbackRows'] = feedbackRows
                        })
                        measuresWithFeedback.push(measureWithFeedback)    
                    })                    
//                    patientFeedbackLookupResult['emailId'] = pt[emailId]                      
                    patientFeedbackLookupResult['measuresWithFeedback'] = measuresWithFeedback
                    res.json(patientFeedbackLookupResult);
                }    
            } catch (error) {
                return next(error);
            }
        }   
    } catch (error) {
        return next(error);
    }              
});

// READ Single patientFeedback
router.get('/:id', async (req, res, next) => {
    try {
        const data = await patientFeedback.findOne({patientFeedbackId:req.params.id});
        res.json(data);
    } catch (error) {
        return next(error);
    }
});
// UPDATE patientFeedback
router.route('/:id')
     // Update patientFeedback Data
    .put(async (req, res, next) => {
        try {
            const data = await patientFeedback.updateOne({patientFeedbackId:req.params.id}, {
                $set: req.body,
            }, { new: true });
            res.json(data);
            console.log("patientFeedback updated successfully!");
        } catch (error) {
            return next(error);
        }
    });

// DELETE patientFeedback
router.delete('/:id', async (req, res, next) => {
    try {
        const data = await patientFeedback.deleteOne({patientFeedbackId:req.params.id});
        res.status(200).json({
            msg: data,
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;