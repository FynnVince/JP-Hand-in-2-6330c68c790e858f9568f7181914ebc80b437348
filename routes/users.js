const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const session = require('express-session');



const { Company } = require("../models/companySchema");
const { Signup } = require("../models/SignupSchema");
const { Listing } = require("../models/listingSchema");


// I used the bcrypt Documentation https://www.npmjs.com/package/bcrypt to write the 2 follwoing functions
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function checkPassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

router.get("/signup", (req, res) => {
  res.render("users/signup", { layout: 'users/layout', title: "Sign-up" });
});

router.get("/login", async (req, res) => {
  res.render("users/login", { layout: 'users/layout', title: "Login" });
});


router.post("/api/login", async (req, res) => {
  try {
    
    const email = req.body.email;
    const password = req.body.password;

    const user = await Signup.findOne({ email: email }); // Check if there is a matching Email in the DB

    if (!user) {
      return res.sendStatus(404);
    }// If there isn't send a Not Found error
    if (await checkPassword(password, user.password) !== true) {
      return res.status(401).json({ message: "Invalid password" });
    }// if the password doesn't match send a Invalid Password message
    else{
  // if there are no errors send 2 cookies, one for the UserId and a companyId, for later use.
    const userId = user._id
    const companyId = user.companyId;
    res.cookie('userId', userId, {
      httpOnly: true,      //I made the cookie using ChatGPT
      secure: true,         
      maxAge: 60 * 60 * 1000, 
      sameSite: 'lax'      
    });
    console.log("UserId Cookie erstellt")
    res.cookie('companyId', companyId, {
      httpOnly: true,      
      secure: true,        
      maxAge: 60 * 60 * 1000, 
      sameSite: 'lax'      
    });

    console.log("Succesfully logged in");
    res.redirect("/users/createjob");
  }
  } catch (err) {
    res.status(500).send("Internal Server Error");
    
  }
});


async function fetchCandJwithoutfilter() {
  // Fetch all Jobs and Companies which are connected to each other.
  const filteredCompanies = await Company.find();
  
  const allJobsAndCompanies = await Promise.all(filteredCompanies.map(async company => {
    const filteredJobs = await Listing.find({ companyId: company._id });
    return filteredJobs.map(job => ({ job, company }));
  }));
  console.log(allJobsAndCompanies.flat());
  return allJobsAndCompanies.flat();

  
}

async function fetchCandJ(filters) {
  // Fetch all Jobs and Companies based on the filters given by the User.
  console.log(`Im fetchCandJ: ${filters}`);
  const filteredCompanies = await Company.find(filters);
  
  const allJobsAndCompanies = await Promise.all(filteredCompanies.map(async company => {
    const filteredJobs = await Listing.find({ companyId: company._id });
    return filteredJobs.map(job => ({ job, company }));
  }));
  console.log(allJobsAndCompanies.flat());
  return allJobsAndCompanies.flat();
}

function isAllEmptyStrings(obj) {
  return Object.values(obj).every(value => value === ''); // I made this function using ChatGPT
}
function isAllUndefined(obj) {
  return Object.values(obj).every(value => value === undefined); // I made this function using ChatGPT
}

function deleteEmptyStrings(obj) {
  for (let key in obj) {
    if ( "" === obj[key]) {
      delete obj[key]; 
    }
  }
  console.log(obj)
  return obj
} // I made this function using ChatGPT

async function fetchIndustires() {
  const industries = await Company.distinct('industry');

  return industries
}

//This route renders all jobs in the Database, based on your filters. If you have no filters it will render all Jobs in the DB. 
router.get("/codejobs", async (req, res) => {
  try {
// Get all the filters which the user send into their respected consts
    const { fundingStage, industry, teamsize } = req.query;

    const filters = {
        fundingStage,
        industry,
        teamsize,
    };
    deleteEmptyStrings (filters)
    // Fetch all jobs and company data without filters
    if(isAllUndefined(filters) === true || isAllEmptyStrings(filters) === true){
      const allJobsAndCompanys = await fetchCandJwithoutfilter();
      const industries = await fetchIndustires()
      console.log(`These are the industries: ${industries}`)
      res.render("users/codejobs", {
        layout: false, 
        allJobsAndCompanys, 
        industries
      });
    }
        
    // Fetch all jobs and companies data with filters
    else{
    
    const allJobsAndCompanys = await fetchCandJ(filters);
  
    console.log(`Im codejobs get${allJobsAndCompanys}`);
    
    const industries = await fetchIndustires()
    console.log(`These are the industries: ${industries}`)
    res.render("users/codejobs", {
      layout: false, 
      allJobsAndCompanys,
      industries
    });
  }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Returns a page with the information of the associated company which was clicked on  
router.get("/codejobs/:companyId", async(req, res)=> {
  try{
    
    const companyId = req.params.companyId
    if (await Company.findOne({_id: companyId})) {
    const companyData = await Company.findOne({_id: companyId})
    console.log(companyData)
    res.render("users/company", {
      layout: false, 
      companyData
    })
  }
  else {
    return res.sendStatus(404);
  }
  }
  catch(err){
    console.error("Error:", err.message);
  }
})

// A route  which renders the createjob page.
router.get("/createjob", isAuthenticated, async (req, res) =>{
  try{
    // get cookie companyID
  const companyId = {companyId: req.cookies['companyId'] }
  console.log(companyId)
  // use the companyID to find the matching company
  const companyData = await Company.findOne({_id: companyId.companyId})
  console.log(companyData)
  // based on the companyID find the Listings which match with the company
  const listings = await Listing.find({ companyId: companyId.companyId })
  console.log(listings)
  res.render("users/createjob", {
    layout: false, 
    companyData, 
    listings
  })
}
catch (err){
  console.error("Error:", err.message);
}
})

// A route which allows the User to delete a job you created
router.post("/api/deleteJob", isAuthenticated, async (req, res) => {
  try{
  Id = req.body.Id
  console.log({_id: Id})

  await Listing.deleteOne({_id: Id})
  res.redirect("/users/createjob");
  } 
  catch (err){
  console.error("Error:", err.message);
  res.sendStatus(500)
}
})

// A route which allows you to update the information of your company
router.post("/api/updateCompanyData", isAuthenticated, async (req, res) =>{
  try{
  const companyId = {companyId: req.cookies['companyId'] }
  const companyData = req.body
  console.log(companyData)
  await Company.findOneAndUpdate({_id: companyId.companyId}, companyData, { runValidators: true })
  res.redirect("/users/createjob");
}
catch(err){
  console.error("Validation Error:", err.message);
  res.sendStatus(500)

}
})

// A route for which you need to be logged in to create a job.
router.post("/api/createJob", isAuthenticated, async (req, res) =>{
  try{
  const companyId = {companyId: req.cookies['companyId'] }
  const listingData = req.body
  console.log(listingData)

  // Create a new listing
  const companyObjectId = new mongoose.Types.ObjectId(companyId.companyId);
  const newListing = new Listing({
    jobTitle: listingData.jobTitle,
    jobDesc: listingData.jobDesc,
    compensation: listingData.compensation,
    employment: listingData.employment,
    url: listingData.url,
    companyId: companyObjectId
  })
  // Validate the listing
  await newListing.validate();
  // Save the listing to the database
  await newListing.save()
  
  res.redirect("/users/createjob");
}
catch(err){
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    console.error("Validation errors:", errors);
    return res.status(400).json({ errors });
    }
  console.error("Error:", err.message);
  res.sendStatus(500)
}
})


// A authentication fucntion which checks if your UserId you have as an a cookie is in the Database. 
async function isAuthenticated (req, res, next) {
  if (await Signup.findOne({ _id: req.cookies['userId'] })) {
    next(); 
  } else {
    res.redirect("/users/login")
  }
}

// This post checks if your signup makes a Datavalidation on your password and checks if your email is already in the DB. 
// Then it creates a new company and and a new Signup with your email and your password which was hashed
router.post("/api/signup", async (req, res) => {
  try {
    console.log("Signup received:", req.body);
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassowrd = await hashPassword(password)
    
    if (await Signup.findOne({ email: email }) && password.length < 8 ) {
      res.sendStatus(209);
    } else {
      //Create new company
      const newCompany = new Company({})
      await newCompany.save()
      console.log(newCompany)
      // Create a new user with the email and password
      const newUser = new Signup({
        email: email,
        password: hashedPassowrd,
        companyId: newCompany._id
      });

      
      await newUser.save();

      res
        .status(201)
        .redirect("../login");
    }
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).send({ error: "Failed to create user" });
  }
});

module.exports = router;
