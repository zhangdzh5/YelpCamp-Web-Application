const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware/index");

// INDEX ROUTES
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	})
});

// NEW ROUTES
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// POST ROUTES
router.post("/", middleware.isLoggedIn, function(req, res){
	const newObj = req.body.campground;
	const author = {
		id: req.user._id,
		username: req.user.username
	}
	newObj.author = author;
	// Create a new campground and save to DB
	Campground.create(newObj, function(err, newlyCamp){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
	
});

// SHOW ROUTES
router.get("/:id", function(req, res){
	//find the camground with provided ID
	//render show template with that campground
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT ROUTES
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE ROUTES
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTES
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Campground deleted!");
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;