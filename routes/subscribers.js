const express = require('express')
const router = express.Router();
const Subscriber = require('../models/subscribers');
const jwt = require('jsonwebtoken');
//testing jwt

router.get('/api', async (req, res)=>{
   res.json({
       message:' Welcome to API'
   });
});
router.post('/api/posts',verifyToken, async (req, res)=>{
    try{
        jwt.verify(req.token,'mysupersecretkey',(err,authData)=>{
            if(err){
                res.sendStatus(403);
            }
            res.json({
                message:' Post Created',
                authData
            });
        });
    }catch(error){
        res.status(400).json({message: error.message});
    }
   
    
 });
 //Format of Token : Authorization : Bearer <access_token> 
 //verifyToken
 function verifyToken(req,res,next){
    //get auth header
    const bearerHeader = req.headers['authorization'];
    //check header exists
    if(typeof bearerHeader !== 'undefined'){
        //split the token with space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set token
        req.token = bearerToken;
        //next middlewhere
        next();
    }else{
        res.status(403).json({message:'Forbidden'});
    }
 }
router.post('/api/login',(req,res)=>{
    //create mock user
    const user = {
        id : 1,
        username: 'demo',
        email : 'demo@gmail.com'
    }
    jwt.sign({user},'mysupersecretkey',{ expiresIn: '30s' },(err,token)=>{
        res.json({
            token
        });
    });
})

//get all
router.get('/', async (req, res)=>{
    try {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})
//getting one
router.get('/:id',getSubscriber,(req, res)=>{
    res.json(res.subscriber)
})

//create one
router.post('/', async (req, res)=>{
    const subscriber = new Subscriber({
        name : req.body.name,
        subscribedToChannel : req.body.subscribedToChannel
    })
    try {
        const newSubscriber = await subscriber.save();
        res.status(201).json(newSubscriber);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

//update one
router.patch('/:id',getSubscriber, async (req, res)=>{
        if(req.body.name != null){
            res.subscriber.name = req.body.name
        }
        if(req.body.subscribedToChannel != null){
            res.subscriber.subscribedToChannel = req.body.subscribedToChannel
        }
        try{
            const updatedSubscriber = await res.subscriber.save();
            res.json(updatedSubscriber);
        }catch(error){
            res.status(400).json({message : error.message})
        }
})
//delete one
router.delete('/:id',getSubscriber,async (req, res)=>{
    try {
        await res.subscriber.remove();
        res.json({message: 'Deleted'})
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

async function getSubscriber(req,res,next){
    let subscriber;
try {
    subscriber = await Subscriber.findById(req.params.id)
    if(subscriber == null){
        return res.status(404).json({message:'No subscriber'})
    }
} catch (error) {
        return res.status(500).json({message:error.message})
    }
    res.subscriber= subscriber;
    next()
}
module.exports = router;