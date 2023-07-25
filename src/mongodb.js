const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/login_mongo")
  .then(() => {
    console.log("connection successfull");
  })
  .catch((e) => {
    console.log("connection failed");
  });
