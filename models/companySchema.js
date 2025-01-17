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

const Company = mongoose.model("Company", companySchema);
module.exports = {
    Company
}