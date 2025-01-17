const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

  const Signup = mongoose.model("Users", SignupSchema);
  
  // Export the models
  module.exports = {
    Signup,
  };