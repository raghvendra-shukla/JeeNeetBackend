const express=require("express");
const router = express.Router();
const Image=require("../models/Image");
const { body, validationResult } = require('express-validator');
const middleware = require("../middelware/middleware");
const multer = require("multer");
const fs=require("fs");
const path=require("path");

const upload=multer({
    storage:multer.diskStorage({
        // cb is for callback you also write any other thing
        destination:(req,file,cb)=>{
            //uploads is the folder name
            cb(null,"uploads");
        },
        filename:(req,file,cb)=>{
            // jpg is for image you use any extension
            // cb(null,file.fieldname+"-"+Date.now()+".jpg");
            cb(null,file.fieldname + '-' + Date.now());
        }
    })
}).single("testImage");

  
// Route1: getImage using get request
router.get('/fetchImage',middleware, async(req, res) => {
    try {
      const img=await Image.findOne({user:req.user.id});
      //  Replace the buffer array with base64 data
      // const imgBase64 = img.image.data.toString("base64");
      // img.image.data = imgBase64;
      // console.log(imgBase64);
      res.json(img.image.data);
      // res.json(img.image);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  });

// creating a route for uploading 
router.post("/addImage",[
    body("name"),
    body("image"),
  ],middleware,async(req,res)=>{
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    // res.send("Uploaded Successfully");
    try{
        const {name,image}=req.body;
        upload(req,res,async(err)=>{
            if(err){
                console.log(err);
            }
            else{
                const newImage=new Image({
                    name,
                    image:{
                        // data:req.file.filename,
                        // data:req.body.filename,
                        data:fs.readFileSync(path.join("C:\\Users\\hp\\OneDrive\\Desktop\\JEE NEET Project\\jee-neet-project\\" + '/uploads/' + req.file.filename)),
                        contentType:"image/jpg"
                    },
                    user:req.user.id
                });
                // create an object alod save the image to the database
                const saveImage= await newImage.save();
                res.send("uploaded SuccessFully");
                // console.log(saveImage);
            }
        });
      }catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
      }
})

// app.get("/",(req,res)=>{
//     // res.render("index");
//     Image.find({}, (err, items) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         else {
//             res.render('index', { items: items });
//         }
//     });
// })


module.exports=router;

