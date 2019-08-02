var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated())
		{
			return next();
		}
	req.flash("error", "You need to be logged in to do that !");
	res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//is user logged in ?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground)=>{
		if(err)
			{
				req.flash("error", "Campground not found !");
				res.redirect("back");
			}
		else
			{
				//is the campground owned by the logged in user ?
				if(foundCampground.author.id.equals(req.user._id))
					{
						next();
					}	
				else
					{
						req.flash("error", "You don't have the permission to do that !");
						res.send("back");
					}
			}
		});
	}	
	else
	{
		req.flash("error", "You need to be logged in to do that !");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in ?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err)
			{
				req.flash("error", "Campground not found");
				res.redirect("back");
			}
		else
			{
				//is the comment owned by the logged in user ?
				if(foundComment.author.id.equals(req.user._id))
					{
						next();
					}	
				else
					{
						req.flash("error", "You don't have permission to do that !");
						res.send("back");
					}
			}
		});
	}	
	else
	{
		req.flash("error", "You need to be logged in to do that !");
		res.redirect("back");
	}
};

module.exports= middlewareObj;