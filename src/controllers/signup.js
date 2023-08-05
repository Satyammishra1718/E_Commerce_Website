const bcrypt = require("bcryptjs");
const User = require("../usermodels");

// Signup form controller
 exports.renderSignupForm = async (req, res) => {
    res.render("views/signup");
  };
  
  // Signup controller
   exports.signupUser = async (req, res) => {
    try {
      const { username, email, password, c_password } = req.body;
  
      const duplicateName = await User.findOne({ uname: username });
      if (duplicateName && duplicateName.uname === username) {
        res.render("views/signup", {
          errorMessage: "This Username is already taken, Please enter a different Username",
          username,
        });
        return;
      }
  
      const duplicateUser = await User.findOne({ email });
      if (duplicateUser && duplicateUser.email === email) {
        res.render("views/signup", {
          errorMessage: "This Email is already taken, Please enter a different Email",
          username,
          email,
        });
        return;
      }
  
      if (password.length < 8) {
        res.render("views/signup", {
          errorMessage: "Password should be at least 8 characters",
          username,
          email,
        });
        return;
      }

      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecial = /[_?()!@#$%^&*.-]/.test(password);
      if (!(hasLower && hasUpper && hasDigit && hasSpecial)) {
        res.render("views/signup", {
          errorMessage:
            "Password should contain at least one lowercase, one uppercase, one digit, and one special character",
          username,
          email,
        });
        return;
      }
  
      if (password !== c_password) {
        res.render("views/signup", {
          errorMessage: "Passwords do not match",
          username,
          email,
        });
        return;
      }
  
      const hashpass = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        uname: username,
        email: email,
        password: hashpass,
        confirmpassword: c_password,
      });
  
       const token=await newUser.generateAuthTokenS();
  
      const savedUser = await newUser.save();
      
      req.flash('success', 'Registration successful! You can now login.');
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };