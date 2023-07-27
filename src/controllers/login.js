const bcrypt = require("bcryptjs");
const User = require("../usermodels");

// Login controller
 exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists with the given email
      const findUser = await User.findOne({ email });
      if (!findUser) {
        res.render("views/login", { errorMessage: "Invalid email or password" });
        return;
      }
  
      // Check password match
      const matchPassword = await bcrypt.compare(password, findUser.password);
      if (!matchPassword) {
        res.render("views/login", { errorMessage: "Invalid email or password" });
        return;
      }

      // Check if some other user is already logged in
      if(req.session.isAuth){
        res.render("views/login",{errorMessage:"Some user is already engaged"});
        return;
      }
 
      // Check if user has a signup token
      if (findUser.signupToken) {
        // Generate token when the user logs in before going to the home page
        const tokenn = await findUser.generateAuthTokenL();
  
        // Store the token in the session
        req.session.isAuth = true;
        req.session.logintoken=tokenn;
        req.session.email=email;
      }

      res.redirect("/home");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };
  
  // Middleware to handle /session-expired route
 exports.sessionExpired = (req, res) => {
  req.session.expires = true;
   res.redirect("/login");
};

// Login form controller
 exports.renderLoginForm = async (req, res) => {
  const sessionExpired = req.session.expires;
  if (sessionExpired) {
    var errorMessage = "Session Timeout: You have been logged out due to inactivity.";
    // Clear the session flag
    delete req.session.expires;

    const loginToken = req.session.logintoken;
    if (loginToken) {
      // Find the user by the login token and delete the login token from the MongoDB database
      try {
        await User.findOneAndUpdate({ loginToken }, { $unset: { loginToken: " " } });
        req.session.isAuth = false;
        req.session.logintoken=" ";
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Get the success message from flash messages
  const successMessage = req.flash('success')[0];

  res.render('views/login', { errorMessage, successMessage });
};


   