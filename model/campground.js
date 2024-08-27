const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Review=require('./review')
const User=require('../model/user')
const ImageSchema=new Schema({
            url:String,
            filename:String
        

})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_2000')
})
const opts={ toJSON : {virtuals:true}}
const campGroundSchema= new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    images:[ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews:[{type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts)
campGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return  `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
})
campGroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
         await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
         })
    }

})

module.exports=mongoose.model('Campground',campGroundSchema)