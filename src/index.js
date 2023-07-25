const express=require("express");
const app=express();
const path=require("path")
const hbs=require("hbs")
require("./mongodb")
const router=require("./routers")

const template_path=path.join(__dirname,"../templates")
const static_path=path.join(__dirname,"../public")

const PORT=process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))
app.use(router);

app.set("view engine","hbs");
app.set("views",template_path)

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
})