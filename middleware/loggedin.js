const campground=require("../model/campground")
const expresserror=require('../utilities/expresserrors')
const {campschema}=require("../schema")
const Review=require("../model/review")
module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; 
        req.flash('error','You should be signed in')
        return res.redirect('/login')
    }
    next()
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validate=(req,res,next)=>{
    
    const {error}=campschema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(",")
        throw new expresserror(msg,400)
    }
    else{
        next()
    }

}
module.exports.isauthor=async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id)
    if(!camp.author.equals(req.user._id)){
         req.flash('error','You cannot upadte this campground' )
         return res.redirect(`/campgrounds/${id}`)
    }
    next()

}
module.exports.isreviewauthor=async(req,res,next)=>{
    const {id,reviewId}=req.params
    const rev=await Review.findById(reviewId)
    if(!rev.author.equals(req.user._id)){
         req.flash('error','You cannot upadte this campground' )
         return res.redirect(`/campgrounds/${id}`)
    }
    next()

}
const {reviewschema}=require("../schema")

module.exports.validatereview=(req,res,next)=>{
    
    const {error}=reviewschema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(",")
        throw new expresserror(msg,400)
    }
    else{
        next()
    }

}
