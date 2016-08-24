var mongoose = require('mongoose');

var img_schema=mongoose.Schema({
  title:{type: String, required:true}
});

 var Imagen=mongoose.model("Imagen",img_schema);

module.exports = Imagen;
