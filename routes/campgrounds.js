var express=require("express");
var	router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

//INDEX ROUTE - show all campgrounds
router.get('/', (req, res)=>{
	Campground.find({},(err,allCampgrounds)=>{
		if(err)
			{
				console.log("error");
			}
		else
			{
				res.render("campgrounds/index", {campgrounds: allCampgrounds});  
			}
	});
	//res.render("campgrounds", {campgrounds: campgrounds}); // not using this array anymore, we have a DB instead !
});

//NEW ROUTE - show a form to create a new campground in DB
router.get('/new', middleware.isLoggedIn, (req,res)=>{
	res.render("campgrounds/new");
});

//CREATE ROUTE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req,res)=>{
	//catch data from form
	var name=req.body.name;
	var image=req.body.image;
	var price=req.body.price;
	var desc=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	};
	var newCampground={name: name, price: price,image: image, description: desc, author: author};
	//create a new campground and save it to DB
	Campground.create(newCampground,(err, newlyCreated)=>{
		if(err)
			{
				req.flash("error", "Campground not found !");
				console.log("error");
			}
		else
			{
				req.flash("success", "Campground created successfully !");
				//redirect
				res.redirect('campgrounds/index');
			}
	});
	
});

//SHOW ROUTE - index of a single campground
router.get('/:id', (req,res)=>{
	//find the campground with provided id (.findById) and populate it with full comment(s) rather than just comment IDs
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err)
			{
				console.log("error");
			}
		else
			{
				//render show template with that campground
				res.render("campgrounds/show", {campground: foundCampground});
			}
	});
});

//EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});


//UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership,(req, res)=>{
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		//redirect to show page
		res.redirect('/campgrounds/' + req.params.id );
	});
});

//DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership,(req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		req.flash("success", "Campground removed successfully !");
		res.redirect('/campgrounds');
	});
});

module.exports=router;