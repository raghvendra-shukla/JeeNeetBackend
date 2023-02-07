const mongoose=require("mongoose");
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        require:true
    },
    standard:{
        type:String,
        require:true
    },
    subjects:{
        type:String,
        require:true
    },
    books:{
        type:String,
        require:true
    },
    auther:{
        type:String,
        require:true
    },
    query:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Feedback",FeedbackSchema);