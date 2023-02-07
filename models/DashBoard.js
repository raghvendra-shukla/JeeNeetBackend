const mongoose=require("mongoose");
const { Schema } = mongoose;

const DashBoardSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    country:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model("Dashboard",DashBoardSchema);