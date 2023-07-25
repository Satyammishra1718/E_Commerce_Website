const User = require("../usermodels");
const bcrypt = require("bcryptjs");

 exports.user_profile = async (req, res) => {
  try {
    const isAuth = req.session.isAuth;
 
   if (!isAuth) {
     res.redirect("/login");
     return;
   }
    const emaill= req.session.email;
    const user = await User.findOne({email:emaill });

    const { uname, email } = user;
    console.log(uname,email);


    res.render("views/user", { uname, email });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

 exports.render_profile=async(req,res)=>{
  res.render("views/update_user");
 }

 exports.update_profile = async (req, res) => {
  const lToken = req.session.logintoken;
  const isAuth = req.session.isAuth;

  if (!isAuth) {
    res.redirect("/login");
    return;
  }

  if (lToken) {
    const emaill= req.session.email;
    const { username, email, password } = req.body;

    try {
      const user = await User.findOne({ email:emaill });

      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(isPasswordMatch);

        if (isPasswordMatch) {
          user.uname = username;
          user.email = email;
          await user.save();

          res.render("views/update_user", { successMessage: "Profile updated successfully" });
        } else {
          res.render("views/update_user", {errorMessage: "Incorrect password. Please try again." });
        }
      } 
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/login");
  }
};
