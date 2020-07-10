const express = require("express");
const router  = express.Router();
const passport = require('passport');
const User = require("../models/user");

// LANDING
router.get("/", function(req, res){
	res.render("landing");
});



// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handling user sign up
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
    		console.log(err);
    		return res.render("register", {error: err.message}); // To fix the flash message issue
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});
//login logic
//middleware
router.post("/login", passport.authenticate("local", {
	// successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: 'Invalid username or password.',
	// successFlash: 'Welcome back, ' + req.body.username
}), function(req, res){
	req.flash("success", "Welcome back " + req.body.username + "!");
	res.redirect("/campgrounds");
});

// LOG OUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have logged out!");
	res.redirect("/campgrounds");
});

module.exports = router;