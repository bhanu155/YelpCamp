var express=require("express");
var	router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");

//==========================================================================
//|||	COMMENT ROUTES  |||
//==========================================================================

//NEW ROUTE for COMMENT
router.get('/new', middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if(err)
			{
				console.log("error!");
			}
		else
			{
				res.render("comments/new", {campground: foundCampground});
			}
	});
});
//CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res)=>{
	//find the campground
	Campground.findById(req.params.id, (err, campground)=>{
		if(err)
		{
			console.log(err);
			res.redirect('/campgrounds');
		}
		else
		{
			//create new comment
			Comment.create(req.body.comment, (err, comment)=>{
				if(err)
				{
					console.log(err);
				}
				else
					{
						//add username and IDs to comments
						comment.author.id= req.user._id;
						comment.author.username=req.user.username;
						comment.save();
						//connect new comment to campground
						campground.comments.push(comment);
						campground.save();
						//redirect to campground show page
						req.flash("success", "Successfully added !");
						res.redirect('/campgrounds/' + campground._id );
					}
			});
		}		
	});
});

//EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
	
});
//UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err)=>{
		if(err)
		{
			res.redirect("back");
		}
		else
			{
				req.flash("success", "Successfully edited !");
				res.redirect('/campgrounds/'+ req.params.id);
			}
	});
});
//DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err)
			{
				res.redirect("back");
			}
		req.flash("success", "successfully deleted !");
		res.redirect('/campgrounds/' + req.params.id);
	});
});

module.exports=router;