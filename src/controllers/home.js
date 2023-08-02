const axios=require("axios");
const User = require("../usermodels");

// Home page controller
 exports.renderHomePage = async (req, res) => {
  const isAuth = req.session.isAuth;
  const lToken=req.session.logintoken;

  if (!isAuth) {
    res.redirect("/login");
    return;
  }

  try {
    if(lToken){
     // Fetch product data from the e-commerce API
     const response = await axios.get('https://fakestoreapi.com/products?limit=18');
     const products = response.data; // Assuming the API response contains an array of products
     req.session.products=products;

     // Render the home page view and pass the product data for rendering
     res.render("views/home", { products });
     return;
   }else{
    res.redirect("/login")
  }
    
  } catch (error) {
    console.log(error);
  }
};

// Logout controller
 exports.logoutUser = async (req, res) => {

  const loginToken = req.session.logintoken;
      try {
        await User.findOneAndUpdate({ loginToken }, { $unset: { loginToken: 1} });
        req.session.isAuth = false;
        req.session.logintoken=" ";
        res.redirect('/login');
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
      };
    