// backend/routes/userProfiles.route.js

const express = require('express');
const router = express.Router();
const userProfile = require('../models/userProfiles');
const counter = require('../models/counter');
const patient = require('../models/patients');
let nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config(); // For loading environment variables


// Load environment variables from .env file
const { API_BASE_URL } = process.env;
const { EMAIL_FROM } = process.env;
const { ADMIN_USER_INVITE_RECIEVER } = process.env;
const { DEFAULT_EMAIL_TO } = process.env;
const { DEFAULT_EMAIL_CC } = process.env;
const { EMAIL_API_KEY } = process.env;




// READ userProfiles
router.get('/test', async (req, res, next) => {
    try {
        res.send('Hello api/userProfiles/testing')
    } catch (error) {
        return next(error);
    }
});

// CREATE userProfile

router.post('/invite/:pid', async (req, res, next) => {    
    try {
            const pt = await patient.findOne({patientId:req.params.pid});
            if (pt==null){
                let errMsg = "Patient does not exists in system"
                console.log(errMsg);
                res.status(404).json({
                        msg: errMsg,
                });           
            } else {
                    try {
                        const myUUID = crypto.randomUUID();
                        console.log(pt.emailId)
                        const user = await userProfile.findOneAndUpdate(
                            {userName:pt.emailId},
                            {userProfileId:myUUID,
                            password : "",     
                            userStatus:"Invited",
                            updatedBy:"Admin"
                            },
                            { new: false }                            
                        );
                        if (user==null){
                            try {                    
                                const newUserProfile = new userProfile(
                                    {
                                        userProfileId:myUUID,
                                        userName:pt.emailId,
                                        userType:"Mobile",
                                        patientId:pt.patientId,
                                        userStatus:"Invited",
                                        createdBy:"Admin",
                                        updatedBy:"Admin"
                                    }
                                )
                                newUserProfile.save()
                                console.log(newUserProfile);
                            } catch (error) {
                                return next(error);
                            }
                        } else {
                                console.log("userProfile has already been invited!" + user.userProfileId);  
//                                myUUID = user.userProfileId;
/*                                try {                    
                                    const newUserProfile = new userProfile(
                                        {
                                            userProfileId:myUUID,
                                            userName:pt.emailId,
                                            userType:"Mobile",
                                            patientId:pt.patientId,
                                            userStatus:"Invited",
                                            createdBy:"Admin",
                                            updatedBy:"Admin"
                                        }
                                    )
                                    newUserProfile.save()
                                    console.log(newUserProfile);
                                } catch (error) {
                                    return next(error);
                                }    */                            
                        }                        
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                            user: EMAIL_FROM,
                            pass: EMAIL_API_KEY
                        }
                        });
                        let mailOptions = {
                        from: EMAIL_FROM,
                        to: 'yejellar@gmail.com',
                        subject: 'User registration',
                        text: 'Please register by clicking the below link \n' +API_BASE_URL+'/userProfiles/register/'+myUUID
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                        });                                
                        console.log("userProfile invited successfully!");
                        res.json("userProfile has been invited!");  
                    } catch (error) {
                        return next(error);
                    }
            }        
    } catch (error) {
        return next(error);
    }        
});

// CREATE userProfile

router.post('/inviteAdmin/:userName', async (req, res, next) => {    
    try {
            const myUUID = crypto.randomUUID();
            console.log("Inviting " + req.params.userName)
            const user = await userProfile.findOneAndUpdate(
                {userName:req.params.userName},
                {userProfileId:myUUID,
                password : "", 
                userStatus:"Invited",
                updatedBy:"System"
                },
                { new: false }                            
            );
            if (user==null){
                try {                    
                    const newUserProfile = new userProfile(
                        {
                            userProfileId:myUUID,
                            userName:req.params.userName,
                            patientId:0,
                            userType:"Admin",
                            userStatus:"Invited",
                            createdBy:"System",
                            updatedBy:"System"
                        }
                    )
                    newUserProfile.save()
                    console.log(newUserProfile);
                } catch (error) {
                    return next(error);
                }
            } else {
                    console.log("userProfile has already been invited!" + user.userProfileId);  
            }                        
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: EMAIL_FROM,
                pass: EMAIL_API_KEY
            }
            });
            let mailOptions = {
            from: EMAIL_FROM,
            to: ADMIN_USER_INVITE_RECIEVER,
            cc: [DEFAULT_EMAIL_CC],
            subject: 'Admin User registration',
            text: 'Please register by clicking the below link \n' +API_BASE_URL+'/userProfiles/register/'+myUUID
            };
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });                                
            console.log("userProfile invited successfully!");
            res.json("userProfile has been invited!");  
    } catch (error) {
        return next(error);
    }        
});

router.post('/forgotpwd/:userName', async (req, res, next) => {    
    try {
        const myUUID = crypto.randomUUID();
        const user = await userProfile.findOneAndUpdate(
            {userName:req.params.userName},
            {userProfileId:myUUID,
            password : "",  
            userStatus:"Forgot Pwd",
            updatedBy:"Admin"
            },
            { new: false }                            
        );
        if (user==null){
            console.log("userProfile doesnt exist!" + req.params.userName); 
            res.json("userProfile doesnt exist!"); 
        } else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: EMAIL_FROM,
                pass: EMAIL_API_KEY
            }
            });
            let mailOptions = {
            from: EMAIL_FROM,
            to: DEFAULT_EMAIL_TO,
            subject: 'Reset password',
            text: 'Please reset password by clicking the below link \n' +API_BASE_URL+'/userProfiles/register/'+myUUID
            };
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });                                
            console.log("Password rest link has been sent successfully!");
            res.json("Password rest link has been sent successfully to the registred email!"); 
        }     
    } catch (error) {
        return next(error);
    }        
});

router.get('/register/:profileId', async (req, res, next) => { 
    try {
        const resetEndPoint =  API_BASE_URL+'/userProfiles/reset'
        const user = await userProfile.findOne({userProfileId:req.params.profileId},{userName:1});        
        if (user==null){
            let errMsg = "userProfile invite does not exists in system"
            console.log(errMsg);
            res.status(404).json({
                msg: errMsg,
            });           
        } else {
            console.log(user);
            res.render('register',{user,resetEndPoint});
        } 
    } catch (error) {
        return next(error);
    }     
  });
 
router.put('/reset', async (req, res, next) => { 
    try {
        const dummyuserProfile = new userProfile(
            {
                userName:req.body.userName                   
            }
        )        
        const data = await userProfile.findOneAndUpdate(
            {userName:req.body.userName}, 
            {password : dummyuserProfile.password = dummyuserProfile.generateHash(req.body.password), 
             userStatus:"PW Updated",
             updatedBy:req.body.updatedBy,
             registeredAt:Date.now()
            },
            { new: false }
        );
        //data.password = req.body.password
        console.log(data);
        res.json("userProfile registered successfully!");
        console.log("userProfile registered successfully!")                   
    } catch (error) {
        return next(error);
    }     
  });
    
  router.put('/login', async (req, res, next) => { 
    try {
        if (req.body.userName=="Admin") {
            req.body.userType = "Admin"
        } else {
            req.body.userType = "Mobile"
        }
        const cd = await userProfile.findOneAndUpdate(
            {userName:req.body.userName,userType:req.body.userType},
            {lastLogin:Date.now()}
        );
        console.log(cd)
        if (cd==null){

            let errMsg = "User name does not exists " + req.body.userName
            console.log(errMsg);
            res.status(401).json({
                    msg: errMsg
            });              
        } else {  
            if (!cd.validPassword(req.body.password)) {
                //password did not match
                let errMsg = "User password does not match"
                console.log(errMsg);
                res.status(401).json({
                        msg: errMsg
                });              
              } else {
                cd['password'] = '**********'

                // password matched. proceed forward
                if (cd.patientId!=null) {
                    try {
                        const data = await patient.findOne({patientId:cd.patientId});
                        res.json(data);
                        console.log("User login successfully")
                    } catch (error) {
                        return next(error);
                    }
                } else {               
                    res.json(cd)
                    console.log("User login successfully")
                }
              }
        }
    } catch (error) {
        return next(error);
    }    
  });


// READ userProfiles
router.get('/All', async (req, res, next) => {
    try {
        const data = await userProfile.find();
        res.json(data);
    } catch (error) {
        return next(error);
    }
});


// UPDATE userProfile
router.route('/:id')
    // Get Single userProfile
    .get(async (req, res, next) => {
        try {
            const data = await userProfile.findOne({userProfileId:req.params.id});
            res.json(data);
        } catch (error) {
            return next(error);
        }
    })
    // Update userProfile Data
    .put(async (req, res, next) => {
        try {
            const data = await userProfile.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.json(data);
            console.log("userProfile updated successfully!");
        } catch (error) {
            return next(error);
        }
    });

// DELETE userProfile
router.delete('/userProfiles/:id', async (req, res, next) => {
    try {
        const data = await userProfile.findByIdAndRemove(req.params.id);
        res.status(200).json({
            msg: data,
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
