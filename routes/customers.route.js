// backend/routes/customer.route.js

const express = require('express');
const router = express.Router();
const customer = require('../models/customer');
const counter = require('../models/counter');


// READ customers
router.get('/test', async (req, res, next) => {
    try {
        res.send('Hello api/customers/testing')
    } catch (error) {
        return next(error);
    }
});

// CREATE customer

router.post('/', async (req, res, next) => {    
    try {
        const cd = await counter.findOneAndUpdate(
            {seqFor:"customer"},
            {"$inc":{"seqId":1}},
            {new:true}
        );
        let seqId;
        if (cd==null){
            const newCounter = new counter({seqFor:"customer","seqId":201})
            seqId = 201
            newCounter.save()
        } else {            
            seqId = cd.seqId
        }
        try {
            const newCustomer = new customer(
                {
                    customerId:seqId,
                    preferredCustomerId:req.body.preferredCustomerId,
                    customerName: {
                        firstName:req.body.customerName.firstName,
                        lastName:req.body.customerName.lastName,
                    },
                    emailId:req.body.emailId,
                    userName:req.body.userName,                    
                    createdBy:req.body.createdBy,
                    updatedBy:req.body.updatedBy
                }
            )
            newCustomer.save()
            //newCustomer.password = req.body.password
            console.log(newCustomer);
            res.json(newCustomer);  
        } catch (error) {
            return next(error);
            //res.status(500).send("Unable to create customer")  
        }        
    } catch (error) {
        return next(error);
    }
});

// Assign survey item to customers
router.put('/AssignItem', async (req, res, next) => {
    try {
        const data = await customer.findOneAndUpdate(
            {customerId:req.body.customerId}, 
            {$push : {'assignedSurveyItems': req.body.assignedSurveyItems}, 
             updatedBy:req.body.updatedBy 
            },
            { new: true }
        );
        //data.password = req.body.password
        res.json(data); 
        console.log("customer registered successfully!");        
        //res.send('Hello api/customers/AssignItems')
    } catch (error) {
        return next(error);
    }
});

// Post survey results to customer
router.put('/SaveRating', async (req, res, next) => {
    try {
        const dateNow = Date.now();
        const data = await customer.findOneAndUpdate(
            {customerId:req.body.customerId}, 
            {$push : {'postedSurveyItemResults': req.body.postedSurveyItemResults},
             updatedBy:req.body.updatedBy 
            },
            { new: true }
        );
        //data.password = req.body.password
        res.json(data); 
        console.log("customer ratings saved successfully!");        
        //res.send('Hello api/customers/AssignItems')
    } catch (error) {
        return next(error);
    }
});

// READ customers
router.get('/All', async (req, res, next) => {
    try {
        const data = await customer.find();
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

router.get('/getResults/:id', async (req, res, next) => {
    try {
        const data = await customer.findOne({customerId:req.params.id});
        let itemObject = {}
        data['postedSurveyItemResults'].forEach(itemResult =>{
            if (itemResult['item'] in itemObject) {

            } else {
                let resultArray = []
                mainItem = itemResult['item']
                let dummyObject = {}
                data['postedSurveyItemResults'].forEach(result =>{
                    if (result['item'] == mainItem) {
                        dummyObject['postedTime'] = itemResult['postedTime']                             
                        result['rateCategoriesList'].forEach(category =>{
                        dummyObject[category['category']] = category['responseScore']+'-'+category['responseMessage']  
                        })
                        resultArray.push(dummyObject)
                    }   
                })
                itemObject[mainItem] = resultArray
            }   
/*
        let itemObject = {}
        data['postedSurveyItemResults'].forEach(itemResult =>{
            if (itemResult['item'] in itemObject) {

            } else {
                let resultArray = []
                mainItem = itemResult['item']
                let dummyObject = {}
                let categoryObject = {}
                let i = 0
                dummyObject["category"] = 'postedTime'
                data['postedSurveyItemResults'].forEach(result =>{
                    if (result['item'] == mainItem) {
                        i++
                        itemKey="postedTime"+i
                        dummyObject[itemKey] = result['postedTime']                             
                        //console.log(result['item'], result['postedTime'])
                        result['rateCategoriesList'].forEach(category =>{
                            //console.log(itemKey)
                            if (category['category'] in categoryObject) {
                                categoryObject[category['category']][itemKey] = category['responseScore']+'-'+category['responseMessage']  
                            } else {
                                categoryObject[category['category']] = {'category':category['category'],postedTime1:category['responseScore']+'-'+category['responseMessage']}
                            }
                        })
                    }   
                })
                resultArray.push(dummyObject)
                for (const [key, value] of Object.entries(categoryObject)) {
                    resultArray.push(value)
                }                
                itemObject[mainItem] = resultArray
            }   
*/            
        })
        res.json(itemObject);
    } catch (error) {
        return next(error);
    }
});

// UPDATE customer
router.route('/:id')
    // Get Single customer
    .get(async (req, res, next) => {
        try {
            const data = await customer.findOne({customerId:req.params.id});
            res.json(data);
        } catch (error) {
            return next(error);
        }
    })
    // Update customer Data
    .put(async (req, res, next) => {
        try {
            const data = await customer.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.json(data);
            console.log("customer updated successfully!");
        } catch (error) {
            return next(error);
        }
    });

// DELETE customer
router.delete('/customers/:id', async (req, res, next) => {
    try {
        const data = await customer.findByIdAndRemove(req.params.id);
        res.status(200).json({
            msg: data,
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;