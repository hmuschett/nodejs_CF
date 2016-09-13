var Imagen = require('../models/imagenes');

module.exports = function(img,req,res){

 // para ver laq imagen
 if(req.method === "GET" && req.path.indexOf("edit")<0){
   return true;}
//para poder editar la imagen por que eres el creador
 if( img.creator._id.toString() == res.locals.user._id){
   return true;}


return false
}
