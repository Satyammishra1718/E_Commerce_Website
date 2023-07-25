const User=require("../usermodels");

 exports.contact_us=async (req,res)=>{
   const isAuth = req.session.isAuth;
 
   if (!isAuth) {
     res.redirect("/login");
     return;
   }
   res.render("views/contact");
}

 exports.contact_post=async(req,res)=>{
    const emaill= req.session.email;
    const user=await User.findOne({email:emaill});
    const { uname, email } = user;
    try{
         if(uname!==req.body.uname || email!==req.body.email){
            const errorMessage="User Credentials Invalid!"
            res.render("views/contact",{errorMessage})
         }else{
            user.contactMessage.push(req.body.message);
            await user.save();
        
            const successMessage = "Thank you for contacting us. We will get back to you soon!";
            res.render("views/contact", { successMessage });
         }
    }catch(error){
       res.status(500).send("Internal Server Error");
       console.log(error);
    }

    
 }