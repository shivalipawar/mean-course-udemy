const mongoose = require('mongoose');

//schema creation from docs and its just the blueprint.
const postSchema = mongoose.Schema({
  title : {type:String, required :true},
  content : {type:String, required :true},
  imagePath : {type:String, required :true}
})

//Retrurns above blueprint.
module.exports = mongoose.model('Post',postSchema);
