const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

  const Listing = mongoose.model("Listing", listingSchema);
  module.exports = {
    Listing
  };