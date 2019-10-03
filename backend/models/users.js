const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//schema creation from docs and its just the blueprint.
const userSchema = mongoose.Schema({
  email : {type:String, required :true, unique:true},
  password : {type:String, required :true}
})

userSchema.plugin(uniqueValidator);         //Validator should be like a plugin functinality provided by mongoose.

//Retrurns above blueprint.
module.exports = mongoose.model('User',userSchema);
