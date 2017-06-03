var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var TodoSchema = new Schema(
  {
    content:String,
     updated_at: { type: Date, default: Date.now },
    editing:{
    	type:Boolean,
    	default:false
    },
    completed:{
      type:Boolean,
      default:false
    },  
     _creator : { type: Schema.Types.ObjectId, ref: 'Person' },
});



var TodosSchema = new Schema(
  
)


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
// module.exports = {
// 	Todo:Todo,
// 	DoneItem:DoneItem

// };
module.exports=Todo
