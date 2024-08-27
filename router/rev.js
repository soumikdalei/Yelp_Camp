const express=require('express')
const router=express.Router({mergeParams:true})
const campground = require('../model/campground')
const review=require("../model/review")
const catchasync=require('../utilities/catchAsync')
const reviews=require('../controllers/reviews')


const {validatereview,isloggedin,isreviewauthor}=require('../middleware/loggedin')
router.post('/',validatereview,isloggedin,catchasync(reviews.posting))
router.delete('/:reviewId',isloggedin,isreviewauthor,catchasync(reviews.delete))
module.exports=router