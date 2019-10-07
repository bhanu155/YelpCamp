var express=require("express"),
	app=express(),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	methodOverride=require("method-override"),
	passport=require("passport"),
	localStrategy=require("passport-local"),
	flash=require("connect-flash"),
	// Importing Schema
	Campground = require('./models/campground'),
	Comment=require('./models/comment'),
	User=require('./models/user');
	//var seedDB=require('./seeds');
	//seedDB();

//	IMPORTING ROUTES
var commentRoutes	=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	indexRoutes 	=require("./routes/index");

//	common config.
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
mongoose.connect("*************************************", {
	useNewUrlParser: true,
	useFindAndModify:false
});
app.use(express.static(__dirname + "/public")); //linking css
app.use(methodOverride("_method"));

app.use(flash()); //should be before PASSPORT CONFIG.

//	PASSPORT CONFIG.
app.use(require("express-session")({
	secret: "cra$h",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//	using ROUTES
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(9000, (req,res)=>{
	console.log("serving on port 9000");
});