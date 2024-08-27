const User=require('../model/user')
module.exports.u=(req,res)=>{
   res.render('users/register')
}
module.exports.register=async(req,res,next)=>{
    try{
    const{email,username,password}=req.body
    const u=await new User({email,username})
    const registered= await User.register(u,password) 
    req.login(registered,err=>{
        if(err) return next(err) 
        req.flash('success','Sucessfullly registered')
        res.redirect('/campgrounds')}
)}

    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
   

}
module.exports.login=(req,res)=>{
    res.render('users/login')
}
module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}
module.exports.logini=(req,res)=>{
    req.flash('success','Logged In')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}