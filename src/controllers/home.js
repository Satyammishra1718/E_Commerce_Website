const axios=require("axios");
const User = require("../usermodels");

 exports.renderHomePage = async (req, res) => {
  const isAuth = req.session.isAuth;
  const lToken=req.session.logintoken;

  if (!isAuth) {
    res.redirect("/login");
    return;
  }

  try {
    if(lToken){
     const response = await axios.get('https://fakestoreapi.com/products?limit=18');
     const products = response.data; 
     req.session.products=products;

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
    