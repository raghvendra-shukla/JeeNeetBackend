const express=require("express");
const router = express.Router();
const Cart=require('../models/Cart');
const { body, validationResult } = require('express-validator');
const middleware = require("../middelware/middleware");

// Route1: fetchingAbook using get request
router.get('/fetchbook',middleware, async(req, res) => {
  try {
    const book=await Cart.find({user:req.user.id});
    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});
// Bookname, Subject, BookImg, Author, Class, Price, Buy
// Route2: adding book to cart using post 
router.post("/addbook",[
  body("bookname","please write a name of atleast 2-char").isLength({min:2}),
  body("subject"),
  body("bookimg"),
  body("author"),
  body("standard"),
  body("price"),
  body("buy"),
],middleware,async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const {bookname, subject, bookimg, author, standard, price, buy}=req.body;
    const book=new Cart({
        bookname, subject, bookimg, author, standard, price, buy,user:req.user.id
    });
    const saveData=await book.save();
    res.json(saveData);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

// Route:3 delete book the using delete request
router.delete("/deletebook/:id",middleware,async (req,res)=>{
    //find the book to be delete and delete it
    try{
      let book=await Cart.findById(req.params.id);
      if(!book){return res.status(404).send("Not Found")};
      if(book.user.toString()!==req.user.id){
        return res.send("Not Allowed");
      }
      book=await Cart.findByIdAndDelete(req.params.id);
      res.json("Success:The book has been deleted");
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });


module.exports=router