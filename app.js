if(process.env.NODE_ENV !== 'production'){
     require('dotenv').config()
}


const sanitize=require('express-mongo-sanitize')
const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const session=require('express-session')
const MongoStore = require('connect-mongo');
const methodoverride=require('method-override')
const ejsmate=require('ejs-mate')
const flash=require('connect-flash')
const expresserror=require('./utilities/expresserrors')
const camp=require('./router/camp')
const rev=require('./router/rev')
const passport=require('passport')
const local=require('passport-local')
const user=require('./model/user')
const userroutes=require('./router/users')
const helmet=require('helmet')
app.use(helmet())
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
imgSrc: [
    // all your other existing code
    
    // add this:
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dn1zvhaz2/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
const dbUrL=process.env.DB_URL

mongoose.connect(dbUrL)
const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("Database connected")
})
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))
app.use(sanitize())

app.engine('ejs',ejsmate)



app.use(express.static(path.join(__dirname,'public')))
const store = MongoStore.create({
    mongoUrl: dbUrL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error",function(e){
    console.log("SESSION OVER")
})
const sess={store,name:'session',secret:'thisshouldbeabettersecret',resave:false,saveUninitialized:true,cookie:{
    httpOnly:true,//secure:true,
    expires:Date.now()+1000*60*60*24*7,maxAge:1000*60*60*24*7}
}
app.use(session(sess))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new local(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
app.use((req,res,next)=>{
    
    res.locals.currentuser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.edit=req.flash('edit')
    next()
})
app.get('/',(req,res)=>{
    res.render('home')
})
app.use('/',userroutes)
app.use('/campgrounds',camp)
app.use('/campgrounds/:id/reviews',rev)
app.get('/fake',async(req,res)=>{
    const u=new user({email:'Soumikdalei@gmail.com',username:'Soumik'})
    const r=await user.register(u,'soumik')
    res.send(r)
})

app.all('*',(req,res,next)=>{
    next(new expresserror("Page not found!!",404))
})
app.use((err,req,res,next)=>{
    const{status=500,message="NOT FOUND"}=err
    res.status(status).render('error',{err})
   
})
app.listen(3000,()=>{
    console.log("LISTENING ON 3000")
})