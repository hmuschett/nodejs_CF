var Imagen = require('../models/imagenes');
var onwer_check= require("./imgen_permission");

module.exports = function (req,res,next){
    Imagen.findById(req.params.id)
    .populate("creator")
    .then(
      (img)=>{
        if(onwer_check(img,req,res)){
          res.locals.img= img;
          console.log("entran aqui");
          next();}
          else {
            res.redirect("/app");
          }
      }),
      (err)=>{
        res.redirect("/app");
      }

}
