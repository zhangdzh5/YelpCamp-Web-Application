const express = require("express");
const router  = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware/index");

//Comments New 
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			const newCom = req.body.comment;
			Comment.create(newCom, function(err, comment){
				if(err){
					req.flash("error", err.message);
					console.log(err);
				} else {
					// add user and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save(function(err, data){
						if(err){
							console.log(err);
						} else {
							req.flash("success", "Successfully added comment!");
							res.redirect("/campgrounds/" + req.params.id);
						}
					});
				}
			});
		}
	});
});

// COMMENT EDIT ROUTES
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// COMMENT UPDATE ROUTES
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedCom){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// COMMENT DELETE ROUTES
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;