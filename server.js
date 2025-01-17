const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const expressLayouts = require('express-ejs-layouts');



//using ejs to make the sites dynamic
app.set("view engine", "ejs");
app.use(expressLayouts);
//Allows to send json with express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sets the port
const PORT = process.env.PORT || 5000;

//connects to mongoDB
mongoose
  .connect(
    process.env.MONGO_URI
    
  )
  .then(() => {
    console.log("Connected to Database");
    
  });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.use(express.static("public"));

// Import user routes
const userRouter = require("./routes/users");

app.use("/users", userRouter);

app.get("/Datenschutzerklaerung", (req, res) => {
  res.send("Easter Egg gefunden 1/1");
});

//Redirects to the codejobs page
app.get("/",(req, res) => {
res.redirect("/users/codejobs")
}) 

