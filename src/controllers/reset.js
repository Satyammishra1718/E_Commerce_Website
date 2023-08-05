const bcrypt = require("bcryptjs");
const User = require("../usermodels");

//Reset password get
 exports.resetPass=async(req,res)=>{
    res.render("views/resetpassword");
    return;
 }

// Reset password controller
 exports.resetPassword = async (req, res) => {
  try {
    const { email, password, c_password } = req.body;

    const findEmail = await User.findOne({ email });
    if (!findEmail) {
      res.render("views/resetpassword", {
        errorMessage: "Invalid email",
        email,
      });
      return;
    }

    if (password !== c_password) {
      res.render("views/resetpassword", {
        errorMessage: "Passwords do not match",
        email,
      });
      return;
    }

    if (password.length < 8) {
      res.render("views/resetpassword", {
        errorMessage: "Password should be at least 8 characters long",
        email,
      });
      return;
    }

    const allUsers = await User.find({});
    for (let user of allUsers) {
      if (await bcrypt.compare(password, user.password)) {
        res.render("views/resetpassword", {
          errorMessage: "This password is already taken, try a new password",
          email,
        });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ email: email }, { password: hashedPassword });

    res.render("views/login", {
      successMessage: "Password updated. Try logging in again.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
