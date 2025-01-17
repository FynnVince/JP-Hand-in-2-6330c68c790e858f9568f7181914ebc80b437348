// models/company.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Company Schema
const companySchema = new Schema({
  name: {
    type: String,
    
    maxlength: 50     
  },
  industry: {
    type: String,
    maxlength: 50     
  },
  teamsize: {
    type: String,
    enum: ["1-10", "11-30", "31-50", "51-100", "100+"],
  },
  fundingStage: {
    type: String,
    enum: ["Seed", "Series-A", "Series-B", "Series-C", "Series-D+", "IPO"],
    
  },
  location: {type: String,  
    maxlength: 50     }
});



// Define Listing Schema
const listingSchema = new Schema({
  jobTitle: {
    type: String,
    maxlength: 180     
  },
  jobDesc: {
    type: String,
    maxlength: 560     
  },
  compensation: {
    type: Number,
    maxlength: 50     
  },
  employment: {
    type: String,
    enum: ["Fulltime Employee", "Intern", "Workingstudent"], 
  },
  url: {
    type: String,
    maxlength: 260     
  },
  datetime: Date,
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
});

const SignupSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); 
      },
      message: props => `${props.value} is not a valid email!` 
    }
  },
  password: {
    type: String,
    minlength: 8,     
    maxlength: 100,
    required: true,     
  },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' }
});

// Create Mongoose models
const Company = mongoose.model("Company", companySchema);
const Listing = mongoose.model("Listing", listingSchema);
const Signup = mongoose.model("Users", SignupSchema);

// Export the models
module.exports = {
  Company,
  Signup,
  Listing,
};
