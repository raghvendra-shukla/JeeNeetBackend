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
            cb(null,path.join(__dirname, '/uploads/'));
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
      const img=await Image.findOne({user:req.user.id},).limit(1).sort({$natural:-1});
      //  Replace the buffer array with base64 data
      // console.log(img.image);
      const imgBase64 = img.image.data.toString("base64");
      img.image.data = imgBase64;
      // console.log(imgBase64);
      // res.contentType('json');
      // res.send(img.image);
    // for the ease just send the base 64 encoded string
      res.send(imgBase64);
      // res.json(img.image);
    } catch (error) {
      res.send("Not Found");
      // console.error(error.message);
      // res.status(500).send("Internal server error occured");
    }
  //   Image.findOne({user:req.user.id}, 'img createdAt', function(err, img) {
  //     if (err)
  //         res.send(err);
  //     console.log(img);
  //     res.contentType('json');
  //     res.send(img);
  // }).sort({ createdAt: 'desc' });
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
                        // data:fs.readFileSync(path.join("C:\\Users\\hp\\OneDrive\\Desktop\\JEE NEET Project\\jee-neet-project\\" + '/uploads/' + req.body.filename)),
                        data:fs.readFileSync(req.file.path),
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

