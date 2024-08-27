const mongoose=require('mongoose')
const User=require('../model/user')
const {Schema}=mongoose
const reviewSchema=new Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:User,
    }

})
module.exports=mongoose.model("Review",reviewSchema)