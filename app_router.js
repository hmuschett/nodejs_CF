var express = require('express');
var router = express.Router();
var Imagen = require('./models/imagenes');
var fs = require('fs');
var redis = require('redis');

var client= redis.createClient();


var find_image_middleware = require('./middleware/find_image');


// var app= express();
//   var bodyParser=require('body-parser');
//   app.use(bodyParser.json());//para peticiones application/json
//  app.use(bodyParser.urlencoded({extended: true}));

router.get("/",function(req,res){
  Imagen.find().populate("creator").then((img)=>{
    //console.log(img);
    res.render("app/home",{imgenes:img});
  })
  .catch((err)=>{console.log(err);})


});


router.get("/imagenes/new",(req, res)=>{
  res.render("app/imagenes/new");
});

//aplicar un middelware a rutas similares
router.all("/imagenes/:id*",find_image_middleware);

router.get("/imagenes/:id/edit",(req, res)=>{
  res.render("app/imagenes/edit");
});


router.route("/imagenes/:id")
.get((req, res)=>{
  //client.publish("imagenes", res.locals.img.toString());
  res.render("app/imagenes/show");
})
.put((req, res)=>{
  res.locals.img.title= req.body.titulo;
  res.locals.img.save();
  res.render("app/imagenes/show");
})
.delete((req, res)=>  {
Imagen.findOneAndRemove({_id: req.params.id}).then(
  ()=>{res.redirect("/app/imagenes");
  console.log("ya esta llegando por el method dalete");
}).
catch((err)=>{console.log(err);});
});


router.route("/imagenes")
.get((req, res)=>{
Imagen.find({creator: res.locals.user._id}).then((imagenes)=>{
  res.render("app/imagenes/index", {imagenes: imagenes})
},(err)=>{
  res.redirect("/app");
});
})
.post( function(req, res){
  let extension = req.body.imagen.name.split(".").pop();
   var data={
     title: req.body.titulo,
     creator: res.locals.user._id,
     extension: extension
   }
   let img = new Imagen(data);
   img.save((err)=>{
     if(!err){
       var imgJSON={
         "id": img._id,
         "title": img.title,
         "extension": img.extension
       };

      client.publish("imagenes", JSON.stringify(imgJSON));
      fs.rename(req.body.imagen.path, "public/imagenes/"+img._id+"."+extension);
      res.redirect("/app/imagenes/"+img._id);
     }else {
        res.render(err);
     }
   });
});



module.exports =router;
