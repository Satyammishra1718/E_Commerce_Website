const User = require("../usermodels");

 exports.payment_render = async (req, res) => {
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
        const username = user.uname;
        let total = req.session.totalAmount;
        const currentDate = new Date();
        let paymentStatus = req.session.paymentStatus || "Failed";

        if (total > 0) {
          const paymentData = {
            username,
            total,
            statuss: paymentStatus,
            date: currentDate,
          };
          user.paymentHistory.push(paymentData);
          req.session.totalAmount = 0;
          paymentStatus = " ";
        }

        try {
          await user.save();
          res.render("views/payment_history", { paymentData: user.paymentHistory });
        } catch (error) {
          console.log(error);
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
