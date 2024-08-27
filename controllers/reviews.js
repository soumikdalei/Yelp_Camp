const campground = require('../model/campground')
const review=require("../model/review")
module.exports.posting=async(req,res)=>{
    const camp=await campground.findById(req.params.id)
    const r=new review(req.body.review)
    r.author=req.user._id
    camp.reviews.push(r)
    await r.save()
    await camp.save()
    req.flash('success','Successfully created new review')
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.delete=async(req,res)=>{
    const {id, reviewId}=req.params
    
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await review.findByIdAndDelete(reviewId)
    
    res.redirect(`/campgrounds/${id}`)

}