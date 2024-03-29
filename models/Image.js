const mongoose=require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        require:true
    },
    image:{
        data:Buffer,
        contentType:String,
        // default:''
    },
    date:{
        type:Date,
        default:Date.now
    }
});
const Image=mongoose.model("Image",ImageSchema);
// by creating indexes values are not repeat
// user.createIndexes();
module.exports=Image;