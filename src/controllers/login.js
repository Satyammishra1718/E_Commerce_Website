const bcrypt = require("bcryptjs");
const User = require("../usermodels");

// Login controller
 exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const findUser = await User.findOne({ email });
      if (!findUser) {
        res.render("views/login", { errorMessage: "Invalid email or password" });
        return;
      }
  
      const matchPassword = await bcrypt.compare(password, findUser.password);
      if (!matchPassword) {
        res.render("views/login", { errorMessage: "Invalid email or password" });
        return;
      }

      if(req.session.isAuth){
        res.render("views/login",{errorMessage:"Some user is already engaged"});
        return;
      }
 
      if (findUser.signupToken) {
        const tokenn = await findUser.generateAuthTokenL();
  
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
  
 exports.sessionExpired = (req, res) => {
  req.session.expires = true;
   res.redirect("/login");
};

 exports.renderLoginForm = async (req, res) => {
  const sessionExpired = req.session.expires;
  if (sessionExpired) {
    var errorMessage = "Session Timeout: You have been logged out due to inactivity.";
    delete req.session.expires;

    const loginToken = req.session.logintoken;
    if (loginToken) {
      try {
        await User.findOneAndUpdate({ loginToken }, { $unset: { loginToken: " " } });
        req.session.isAuth = false;
        req.session.logintoken=" ";
      } catch (error) {
        console.error(error);
      }
    }
  }
  
  const successMessage = req.flash('success')[0];

  res.render('views/login', { errorMessage, successMessage });
};


   