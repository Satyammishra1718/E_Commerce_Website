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
        const cartTotalAmount = decodeURIComponent(req.query.cartTotalAmount);
        const total = cartTotalAmount;
        req.session.cartTotalAmount = cartTotalAmount;
        console.log("Cart Total Amount:", total);
        if (user.cart.length > 0) {
          res.render("views/payment", { total });
        } else {
          req.session.cartMessage = "Your cart is empty";
          res.redirect("/cart");
        }
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
  console.log("Payment route accessed");
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
        const cartTotalAmount = decodeURIComponent(req.query.cartTotalAmount);
        console.log("Decoded Cart Total Amount:", cartTotalAmount);
        req.session.cartTotalAmount = cartTotalAmount;
        res.render("views/payment",{total:cartTotalAmount});
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
