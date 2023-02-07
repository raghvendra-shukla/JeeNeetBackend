const mongoose=require("mongoose");
const { Schema } = mongoose;
// Bookname, Subject, BookImg, Author, Class, Price, Buy

const CartSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    bookname:{
        type:String,
        require:true
    },
    subject:{
        type:String,
        require:true
    },
    bookimg:{
        type:String,
        require:true
    },
    author:{
        type:String,
        require:true
    },
    standard:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    buy:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Cart",CartSchema);