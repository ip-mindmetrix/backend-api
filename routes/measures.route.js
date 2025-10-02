// backend/routes/measures.route.js

const express = require('express');
const router = express.Router();
const measure = require('../models/measures');
const crypto = require('crypto');


// READ measures
router.get('/test', async (req, res, next) => {
    try {
        res.send('Hello api/measures/test')
    } catch (error) {
        return next(error);
    }
});

// CREATE measure
router.post('/', async (req, res, next) => {    
    try {
        const newMeasure = new measure(
            {
                measureId:req.body.measureId,
                measureName:req.body.measureName,
                measureItems:req.body.measureItems,
                measureStatus:req.body.measureStatus,
                createdBy:req.body.createdBy,
                updatedBy:req.body.updatedBy
            }
        )
        newMeasure.save()
        //const data = await measure.create(req.body);
        console.log(newMeasure);
        res.json(newMeasure);
    } catch (error) {
        return next(error);
    }
});

// READ all measures
router.get('/All', async (req, res, next) => {
    try {
        const data = await measure.find();
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// READ Single measures
router.get('/:id', async (req, res, next) => {
    try {
        const data = await measure.findOne({measureId:req.params.id});
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// UPDATE measure
router.route('/:id')
     // Update measure Data
    .put(async (req, res, next) => {
        try {
            const data = await measure.updateOne({measureId:req.params.id}, {
                $set: req.body,
            }, { new: true });
            res.json(data);
            console.log("measure updated successfully!");
        } catch (error) {
            return next(error);
        }
    });

// DELETE measure
router.delete('/:id', async (req, res, next) => {
    try {
        console.log("Ready to Delete document for:", req.params.id);
        const data = await measure.deleteOne({measureId:req.params.id});
        res.status(200).json({
            msg: data,
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;