if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const multer = require("multer");
const upload = multer({dest:'uploads/'});

const port = 8080;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require('./models/listing.js');

const dburl = process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("Successfull Connect to DB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));//for post method
app.use(methodOverrride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs',ejsMate);


const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
     secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
 });

 store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",)
 });
 
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires:Date.now()+ 7 * 24 * 60 * 60 * 100,
        maxAge:7 * 24 * 60 * 60 * 100,
    } 
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//To store information in Session
passport.deserializeUser(User.deserializeUser());//To remove information from session

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
//Search route
app.post("/search",(req,res)=>{
    res.redirect("/listing");
});

//ROOT ROUTE
// app.get("/",(req,res)=>{
//     res.send("Hiii This is Root Page");
// })
//USer ROute
// app.get("/demouser",async (Req,res)=>{
//     let fakeuser = new User({
//         email:"aditya@gmail.com",
//         username:"adity dada"
//     });
//   const data =  await  User.register(fakeuser,"helloworld");
//   res.send(data);
// });

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Terms and Privacy
app.get("/terms",(req,res)=>{
    res.send("Nothing");
})
app.get("/privacy",(req,res)=>{
    res.send("Nothing");
})

//Except All Route
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found!"));
})

//Middleware for error handling
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"} = err;
    res.status(statusCode).render("Error.ejs",{ message });
});

app.listen(port,(req,res)=>{
    console.log(`Port is listining at ${port}.`);
})

