// backend/routes/patients.route.js

const express = require('express');
const router = express.Router();
const patient = require('../models/patients');
const counter = require('../models/counter');
const crypto = require('crypto');


// READ patients
router.get('/test', async (req, res, next) => {
    try {
        res.send('Hello api/patients/test')
    } catch (error) {
        return next(error);
    }
});

// CREATE patient
router.post('/', async (req, res, next) => {    
    try {
        const pt = await patient.findOne({ $or:[{legacyPatientId:req.body.legacyPatientId},
                                                {emailId:req.body.emailId}
                                               ]
                                         } 
        );
        if (pt!=null){
            let errMsg = "Patient already exists in system"
        } else {            
            const cd = await counter.findOneAndUpdate(
                {seqFor:"patient"},
                {"$inc":{"seqId":1}},
                {new:true}
            );
            let seqId;
            if (cd==null){
                const newCounter = new counter({seqFor:"patient","seqId":201})
                seqId = 201
                newCounter.save()
            } else {            
                seqId = cd.seqId
            }    
            try {
                const newpatient = new patient(
                    {
                        patientId:seqId,
                        legacyPatientId:req.body.legacyPatientId,
                        patientName:req.body.patientName,
                        emailId:req.body.emailId,
                        assignedMeasures:req.body.assignedMeasures,
                        createdBy:req.body.createdBy,
                        updatedBy:req.body.updatedBy
                    }
                )
                newpatient.save()
                console.log(newpatient);
                res.json(newpatient);
            } catch (error) {
                return next(error);
            }
        }
    } catch (error) {
        return next(error);
    }        
});

// READ all patients
router.get('/All', async (req, res, next) => {
    try {
        const data = await patient.find();
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// READ Single patient by patient id
router.get('/:id', async (req, res, next) => {
    try {
        const data = await patient.findOne({patientId:req.params.id});
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// READ Single patient by legacy patient id
router.get('/byLegacyPatientId/:lpid', async (req, res, next) => {
    try {
        const pt = await patient.find({legacyPatientId:{$regex:new RegExp(req.params.lpid,"i") }});
        if (pt==null){
            let errMsg = "Patient does not exists in system"
            console.log(errMsg);
            res.status(404).json({
                    msg: errMsg,
            });           
        } else {
            res.json(pt);
        }   
    } catch (error) {
        return next(error);
    }              
});

// UPDATE patient
router.route('/:id')
     // Update patient Data
    .put(async (req, res, next) => {
        try {
            const data = await patient.updateOne({patientId:req.params.id}, {
                $set: req.body,
            }, { new: true });
            console.log("patient updated successfully!");
            res.json(data);            
        } catch (error) {
            console.log("patient updated failed!");
            console.log(error);
            return next(error);            
        }
    });

// DELETE patient
router.delete('/:id', async (req, res, next) => {
    try {
        console.log("Ready to Delete document for:", req.params.id);
        const data = await patient.deleteOne({patientId:req.params.id});
        res.status(200).json({
            msg: data,
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;