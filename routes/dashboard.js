const express=require("express");
const router = express.Router();
const Dashboard=require("../models/DashBoard");
const { body, validationResult } = require('express-validator');
const { request } = require("express");
const middleware = require("../middelware/middleware");

// Route1: fetchingAprofile using get request
router.get('/fetchInfo',middleware, async(req, res) => {
  try {
    const info=await Dashboard.findOne({user:req.user.id}).limit(1).sort({$natural:-1});
    res.json(info);
  } catch (error) {
    console.error(error.message);
    // res.status(500).send("Internal server error occured");
    res.send(null);
  }
});

// Route2: adding new profile using post 
router.post("/addInfo",[
  body("name","please write a name of atleast 2-char").isLength({min:2}),
  body("email"),
  body("phone"),
  body("country"),
  body("city"),
  body("state"),
  body("address"),
],middleware,async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const {name,email,phone,country,city,state,address}=req.body;
    const info=new Dashboard({
        name,email,phone,country,city,state,address,user:req.user.id
    });
    const saveData=await info.save();
    res.json(saveData);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

// route3 to update the profile
router.put("/updateInfo/:id",middleware,async (req,res)=>{
    const {name,email,phone,country,city,state,address}=req.body;
    // creating a profile object
    const newprofile={};
    if(name){newprofile.name=name};
    if(email){newprofile.email=email};
    if(phone){newprofile.phone=phone};
    if(country){newprofile.country=country};
    if(city){newprofile.city=city};
    if(state){newprofile.state=state};
    if(address){newprofile.address=address};
    //find the profile to be update and update it
    let info=await Dashboard.findById(req.params.id);
    if(!info){return res.status(404).send("Not Found")};
    if(info.user.toString()!==req.user.id){
      return res.send("Not Allowed");
    }
    info=await Dashboard.findByIdAndUpdate(req.params.id,{$set:newprofile},{new:true});
    res.json({info});
  });

  // Route:4 delete the using delete request
  router.delete("/deleteInfo/:id",middleware,async (req,res)=>{
    //find the profile to be delete and delete it
    try{
      let info=await Dashboard.findById(req.params.id);
      if(!info){return res.status(404).send("Not Found")};
      if(info.user.toString()!==req.user.id){
        return res.send("Not Allowed");
      }
      info=await Dashboard.findByIdAndDelete(req.params.id);
      res.json("Success:The Info has been deleted");
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });


module.exports=router