// backend/routes/surveyItem.route.js

const express = require('express');
const router = express.Router();
const surveyItem = require('../models/surveyItem');
const counter = require('../models/counter');
const crypto = require('crypto');


// READ surveyItems
router.get('/test', async (req, res, next) => {
    try {
        res.send('Hello api/surveyItems/test')
    } catch (error) {
        return next(error);
    }
});

// CREATE surveyItem
router.post('/', async (req, res, next) => {    
    try {
        const cd = await counter.findOneAndUpdate(
            {seqFor:"surveyItem"},
            {"$inc":{"seqId":1}},
            {new:true}
        );
        let seqId;
        if (cd==null){
            const newCounter = new counter({seqFor:"surveyItem","seqId":101})
            seqId = 101
            newCounter.save()
            //res.status(500).send("Unable to get seq id for surveyItem")      
        } else {            
            seqId = cd.seqId
        }
        try {
            const newsurveyItem = new surveyItem(
                {
                    itemId:seqId,
                    item:req.body.item,
                    rateCategoriesList:req.body.rateCategoriesList,
                    createdBy:req.body.createdBy,
                    updatedBy:req.body.updatedBy
                }
            )
            newsurveyItem.save()
            //const data = await surveyItem.create(req.body);
            console.log(newsurveyItem);
            res.json(newsurveyItem);
        } catch (error) {
            return next(error);
        }        
    } catch (error) {
        return next(error);
    }
});

// READ surveyItems
router.get('/', async (req, res, next) => {
    try {
        const data = await surveyItem.find();
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// UPDATE surveyItem
router.route('/:id')
    // Get Single surveyItem
    .get(async (req, res, next) => {
        try {
            const data = await surveyItem.findById(req.params.id);
            res.json(data);
        } catch (error) {
            return next(error);
        }
    })
    // Update surveyItem Data
    .put(async (req, res, next) => {
        try {
            const data = await surveyItem.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.json(data);
            console.log("surveyItem updated successfully!");
        } catch (error) {
            return next(error);
        }
    });

// DELETE surveyItem
router.delete('/surveyItems/:id', async (req, res, next) => {
    try {
        const data = await surveyItem.findByIdAndRemove(req.params.id);
        res.status(200).json({
            msg: data,
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;