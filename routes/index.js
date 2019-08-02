var express=require("express");
var	router=express.Router();
var passport=require("passport");
var User=require("../models/user");

//HOME PAGE
router.get('/', (req, res)=>{
	res.render("landing");
});

//=========================================================================
//	AUTH ROUTES
//=========================================================================

//	REGISTER
router.get('/register', (req, res)=>{
	res.render("register");
});
router.post('/register', (req, res)=>{
	var newUser= new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err)
			{
				req.flash("error", err.message);
				return res.render('/register');
			}
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Welcome to Yelpcamp  " + newUser.username);
			res.redirect('/campgrounds');
		});
	});
});

//	LOGIN
router.get('/login', (req, res)=>{
	res.render("login");
});
router.post('/login', passport.authenticate("local", {
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}), (req, res)=>{
});

//	LOGOUT
router.get('/logout', (req, res)=>{
	req.flash("success", "Logged you out !");
	req.logout();
	res.redirect('/campgrounds');
});

module.exports=router;