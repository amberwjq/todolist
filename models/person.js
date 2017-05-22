var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var PersonSchema = new Schema(
  {
    name:String,
    password:String,
});
/**
TodoSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};
**/

// // on every save, add the date
// TodoSchema.pre('save', function(next) {
//   // get the current date
//   var currentDate = new Date();
  
//   // change the updated_at field to current date
//   this.updated_at = currentDate;

//   next();
// });
// the schema is useless so far
// we need to create a model using it

var Person = mongoose.model('Person', PersonSchema,'persons');


// make this available to our Node applications
module.exports = Person;