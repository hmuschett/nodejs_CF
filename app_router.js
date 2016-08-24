var express = require('express');
var router = express.Router();
var Imagen = require('./models/imagenes');

// var app= express();
//   var bodyParser=require('body-parser');
//   app.use(bodyParser.json());//para peticiones application/json
//  app.use(bodyParser.urlencoded({extended: true}));

router.get("/",function(req,res){
  res.render("app/home");
});


router.get("/imagenes/new",(req, res)=>{
  res.render("app/imagenes/new");
});
router.get("/imagenes/:id/edit",(req, res)=>{

});



router.route("/imagenes/:id")
.get((req, res)=>{
  Imagen.findById(req.params.id).then((img)=>{
    if(img){res.render("app/imagenes/show",{imagen:img});}
    console.log(img+" este es el titulo de la img");
  },(err)=>{console.log(err+" este es el error al buscar la img y rederisar en la vista show");});

})
.put((req, res)=>{

})
.delete((req, res)=>{

});

router.route("/imagenes")
.get((req, res)=>{

})
.post((req, res)=>{
  console.log(req.body+"lo que tiene el body dentro");
  console.log(req.body.nombre+ " lo que tiene el body.nombre dentro");
 var data={
   title: req.body.nombre
 }
 console.log(data);
 var img = new Imagen(data);
 img.save((err)=>{
   if(!err){
     console.log("app/imagenes/"+img._id);
     res.redirect("/app/imagenes/"+img._id);
   }else {
     console.log("por esto es que no redireciona "+err);
      res.render(err);
   }
 });
});



module.exports =router;
