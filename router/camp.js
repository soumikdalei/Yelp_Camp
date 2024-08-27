const express=require('express')
const router=express.Router()
const catchasync=require('../utilities/catchAsync')
const campgrounds=require('../controllers/campgrounds')
const campground=require("../model/campground")
const multer=require('multer')
const { storage } = require('../cloudinary');
const upload=multer({storage})


const {validate,isauthor,isloggedin}=require('../middleware/loggedin')
router.route('/').get(catchasync(campgrounds.index))
.post(upload.array('image'),validate,isloggedin,catchasync(campgrounds.createcampground))

router.get('/new',isloggedin,campgrounds.new)
router.route('/:id').get(isloggedin,catchasync(campgrounds.showcampground)).put(isloggedin,isauthor,upload.array('image'),validate,catchasync(campgrounds.editcamps))
.delete(isloggedin,catchasync(campgrounds.delete))
router.get('/:id/edit',isloggedin,isauthor,catchasync(campgrounds.editcamp))

module.exports=router