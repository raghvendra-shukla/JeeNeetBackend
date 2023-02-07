const express=require("express");
const router = express.Router();
const Feedback=require('../models/Feedback');
const { body, validationResult } = require('express-validator');
const { request } = require("express");
const middleware = require("../middelware/middleware");

// Route1: fetchingAFeedback using get request
router.get('/fetchfeedback',middleware, async(req, res) => {
  try {
    const feedback=await Feedback.find({user:req.user.id});
    res.json(feedback);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

// Route2: adding new feedback using post 
router.post("/addfeedback",[
  body("name","please write a name of atleast 2-char").isLength({min:2}),
  body("class"),
  body("subjects"),
  body("books"),
  body("auther"),
  body("query"),
],middleware,async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const {name,standard,subjects,books,auther,query}=req.body;
    const feedback=new Feedback({
      name,standard,subjects,books,auther,query,user:req.user.id
    });
    const saveData=await feedback.save();
    res.json(saveData);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});


module.exports=router