const User = require("../usermodels");

 exports.renderpayment1 = async (req, res) => {
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
        const totalAmount = user.totalAmount || 0; 
        req.session.totalAmount = totalAmount;

        res.render("views/payment", { totalAmount });
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

 exports.renderpayment = async (req, res) => {
  const lToken = req.session.logintoken;
  const isAuth = req.session.isAuth;

  if (!isAuth) {
    res.redirect("/login");
    return;
  }

  if (lToken) {
    const email = req.session.email;
    const totalAmount = req.session.totalAmount;

    try {
      const user = await User.findOne({ email });

      if (user) {
        const { cardNumber, expiryDate, cvv } = req.body;
        var errorMessage = "Invalid Format or Details.";

        const cardNumberPattern = /^(\d{4}\s?){3}\d{4}$/;
        const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
        const cvvPattern = /^\d{3}$/;

         if (!cardNumber.match(cardNumberPattern) || !expiryDate.match(expiryDatePattern) || !cvv.match(cvvPattern) ) {
          req.session.paymentStatus = "Failed";
          return res.render("views/payment",{errorMessage,totalAmount});
        }

        req.session.paymentStatus = "Success";
        user.cart = []; 
        await user.save();
        
        return res.render("views/success");

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
