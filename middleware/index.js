const Campground = require("../models/campground"),
	  Comment = require("../models/comment");

//all middleware go here
const middleObject = {};

// check if user is logged in 
middleObject.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
}

// check if current user has this campground's ownership
middleObject.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			} 
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

// check if current user has this comment's ownership
middleObject.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

module.exports = middleObject;




