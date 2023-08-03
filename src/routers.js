const express = require("express");
const router = express.Router();
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("./usermodels");
const flash = require('connect-flash');

const landing = require("./controllers/landing");
const signup = require("./controllers/signup");
const login = require("./controllers/login");
const home = require("./controllers/home");
const reset = require("./controllers/reset");
const cart = require("./controllers/cart");
const user=require("./controllers/user");
const contact=require("./controllers/contact");
const wishlist=require("./controllers/wishlist");
const payment=require("./controllers/payment");
const success=require("./controllers/success");
const payment_history=require("./controllers/payment_history");
const errorpage=require("./controllers/404error")

// Configure the express-session middleware
router.use(
  session({
    secret: "dwbiudbeiuwuieuidcuiewuirebiuebuibeduxbuifvhuibedyuidev",
    resave: false,
    saveUninitialized: false,
  })
);

router.use(flash());
router.use(express.static("../public/images"));

// Landing page route
router.get("/", landing.renderLandingPage);

// Signup form route
router.get("/signup", signup.renderSignupForm);
router.post("/signup", signup.signupUser);

// Login form route
router.get("/login", login.renderLoginForm);
router.post("/login", login.loginUser);

// session expired
router.get("/session-expired",login.sessionExpired )

// Home page route
router.get("/home", home.renderHomePage);

// Logout route
router.post('/logout', home.logoutUser);
router.get('/logout', home.logoutUser);

// Reset password route
router.get("/reset", reset.resetPass);
router.post("/reset", reset.resetPassword);

// products route
router.post("/addtocart",cart.products)

// cart route
router.get("/cart",cart.productsCart)
router.post("/cart/remove",cart.removeCartItem)
router.post("/cart/reduce",cart.reduceCartItem)

// user route
router.get("/user",user.user_profile)

//contact route
router.get("/contact",contact.contact_us);
router.post("/contact",contact.contact_post);

//wishlist route
router.get("/wishlist",wishlist.wishlist_render)
router.post("/addtowishlist",wishlist.addToWishlist)
router.post("/wishlist/remove",wishlist.removeWishlistItem)
router.post("/wishlist/update",wishlist.wishlist_update)

// profile update route
router.get("/update_profile",user.render_profile);
router.post("/update_profile",user.update_profile);

// payment update route
router.get("/payment",payment.renderpayment1);
router.post("/payment_post",payment.renderpayment);

// success route
router.post("/success",success.success_render);
router.get("/success",success.success_render_1);
router.get("/failed",success.failed_render);

// payment history route
router.get("/payment_history",payment_history.payment_render);

//error page
router.get("*",errorpage.error_render);

module.exports = router;


