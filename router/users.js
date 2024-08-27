const express=require('express')
const router=express.Router()
const catchasync=require('../utilities/catchAsync')
const User=require('../model/user')
const passport=require('passport')
const { storeReturnTo } = require('../middleware/loggedin');
const users=require('../controllers/userc')

router.route('/register').get(users.u).post(catchasync(users.register))
router.route('/login').get(users.login)
.post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.logini)
router.get('/logout', users.logout); 












module.exports=router