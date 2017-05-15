var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.connect('mongodb://localhost/myappdatabase');
// create a schema
var TodoSchema = new Schema(
  {
    id:String,
    content:String,
    update_at:Date
});
/**
TodoSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};
**/

// on every save, add the date
TodoSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  next();
});
// the schema is useless so far
// we need to create a model using it
var Todo = mongoose.model('Todo', TodoSchema);

// make this available to our Node applications
module.exports = Todo;
