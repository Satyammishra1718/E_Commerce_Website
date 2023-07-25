const User=require("../usermodels");

 exports.error_render=async(req,res)=>{
    res.render("views/404error",{
        errormsg : "Opps! Page Not Found👻",
    })
 }
    