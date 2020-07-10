const express 				= require("express"),
	  app 					= express(),
	  bodyParser 			= require("body-parser"),
	  mongoose 				= require("mongoose"),
	  flash					= require("connect-flash"),
	  passport 				= require('passport'),
	  LocalStrategy 		= require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  methodOverride   		= require("method-override"),
	  Campground 			= require("./models/campground"),
	  Comment 				= require("./models/comment"),
	  User                  = require("./models/user"),
	  seedDB 				= require("./seeds"),
// 	  require routes
	  commentRoutes			= require("./routes/comments"),
	  campgroundRoutes		= require("./routes/campgrounds"),
	  indexRoutes			= require("./routes/index");

//require moment.js
app.locals.moment = require("moment");

const databaseUrl = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12";

// connect to the cloud database
mongoose.connect(databaseUrl,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(()=> {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR: ", err.message);
});

// seedDB();
	
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// require it and also using as function, but I didn't know what it is for...
app.use(require("express-session")({
	secret: "LeBron is the best player in the world.",
	resave: false,
	saveUninitialized: false
}));

// tell express to use passport, basically need them everytime when we use the passport package.
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// To more line to be added to make passport works, responsible for reading sessions, taking the data uncoded from the sessions and decoded it.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To pass a variable or function to every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// give some prefix and also use these routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




// Start Server
app.listen(process.env.PORT || 3000, function() {
	console.log('The YelpCamp Server Has Started!');
});