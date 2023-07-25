const User = require("../usermodels");

 exports.success_render_1=async(req,res)=>{
    res.render("views/success");
 }

 exports.failed_render=async(req,res)=>{
    res.render("views/failed");
 }


 exports.success_render = async (req, res) => {
  const lToken = req.session.logintoken;
  const isAuth = req.session.isAuth;

  if (!isAuth) {
    res.redirect("/login");
    return;
  }

  if (lToken) {
    const email = req.session.email;

    try {
      const user = await User.findOne({ email });

      if (user) {
        const { cardNumber, expiry, cvv } = req.body;

        const cardNumberRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
        const cvvRegex = /^\d{3}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;

        if (
          cardNumber.match(cardNumberRegex) &&
          cvv.match(cvvRegex) &&
          expiry.match(expiryRegex)
        ) {
          user.cart = [];
          await user.save();
          req.session.paymentStatus = "Success";
          res.redirect("/success");
        } else {
          req.session.paymentStatus = "Failed";
            res.redirect("/failed");
        }
        return;
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/login");
  }
};
