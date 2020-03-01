var	express 				= require("express"),
	mongoose 				= require("mongoose"),
	session 				= require('express-session'),
	passport 				= require("passport"),
	User 					= require("./models/user"),
	bodyParser	 			= require("body-parser"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose")
	

//=============================================================
// onnects and creates a database
mongoose.connect("mongodb://localhost:27017/auth_demo_app",{  //this is port mongod is running
useNewUrlParser: true,
useUnifiedTopology: true
});   



var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	secret: "mimi is great",
	resave: false,
	saveUninitialized: false,
}));

//this needs to be after app.use 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());		//we added to local-mongoose these predefined methods
passport.deserializeUser(User.deserializeUser());

passport.use( new LocalStrategy(User.authenticate()));	//this is to use authenticate methode



//=====================================
// Root Route
app.get('/', function(req, res){
	res.render("home");
});

//=====================================
// Secret Route
app.get('/secret', isLoggedIn , function(req, res){  //middelware to check if authenticated, here follow function is next
	res.render("secret");
});

//=====================================
// Auth Route
app.get('/register', function(req, res){
	res.render("register");
});

//=====================================
// Auth Route
app.post('/register', function(req, res){
	//first need body parser
	req.body.username
	req.body.password
	//pass in new usernamer and afterwards add password later as 2nd argument and work with a function
	// will return user 
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if (err){								//if there is problem go back to register form
			console.log(err);
			return res.return('register');
		}
		passport.authenticate("local")(req, res, function(){     //will log in all info to db, uses a local storage
			res.redirect("/secret");							 // end up in the secret page, a session
	    });    		
	});
});

//=====================================
// Login Route
app.get('/login', function(req, res){
	res.render("login");
});

//=====================================
// Login logic
app.post('/login', passport.authenticate("local", {  //middlware -> runs before final function, 
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){								//handling function
	// empty for now
});

//=====================================
// Logout Route
app.get('/logout', function(req, res){
	req.logout(); // no transaction delete, just session closing
	res.render("home");
});


//=====================================
// check if logged in or not
function isLoggedIn(req, res, next){ //check is request is authenticated , return next 
	 if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("login");
    }
}


//====================================
app.listen(3000, function() {
 console.log("3000 port we listen to");
});
