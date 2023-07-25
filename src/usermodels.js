const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require("validator")
const jwt=require("jsonwebtoken")

const pcart=new mongoose.Schema({
    idd:{
        type:Number
    },
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number
    }
})

const paymenthistory=new mongoose.Schema({
    username: {
        type: String
      },
      total: {
        type: Number
      },
      statuss: {
        type: String
      },
      date: {
        type: Date
      }
})
const userSchema=new mongoose.Schema({
    uname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("INVALID EMAIL")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength: 8,
        trim: true,
        unique:true
    },
    confirmpassword:{
        type:String,
        required:false,
        minlength: 8,
        trim: true
    },
    signupToken:{
        type:String
    },
    loginToken:{
        type:String
    },
    contactMessage:[{
         type:String
    }],
    totalAmount:{
        type:Number
    },
    cart:[pcart],
    wishlist:[pcart],
    paymentHistory:[paymenthistory]

});

//generating token for signup
userSchema.methods.generateAuthTokenS=async function(){
    try{
      const token =jwt.sign({_id:this._id},"abcdefghijklmnopqrstuvwxyzsatyammishra")
      this.signupToken=token;
    }catch(error){
      console.log(error);
      return error;
    }
}

//generating token for login
userSchema.methods.generateAuthTokenL=async function(){
    try{
      const tokenn =jwt.sign({_id:this._id},"abcdefghijklmnopqrstuvwxyzsatyammishra1718")
      this.loginToken=tokenn;
      await this.save();
      return tokenn;
    }catch(error){
      console.log(error);
      return error;
    }
}

// set confirmpassword to undefined before saving
userSchema.pre("save", async function (next) {
    if(this.confirmpassword){
        this.confirmpassword = undefined;
        next();
    }
  });


const User = mongoose.model('User', userSchema);

module.exports = User;
