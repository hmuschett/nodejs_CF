
var express = require('express');
var app = express();
//para poder leer parametrosr que vienes en el cuerpo de la peticion
var bodyParser=require('body-parser');

var mongoose=require('mongoose');
var session=require("express-session");
var User=require('./models/user').User;//import {User} from './models/user';

var app_router = require('./app_router');//import {app_router} from './app_router';

var session_middleware = require('./middleware/session');
mongoose.connect("mongodb://localhost/datos");

app.set('view engine', 'pug')
// si la carpeta de llama views la coge por defecto y no hace falta la linea de abajo
app.set('views', './viewstr');

//para servir los archivos estaticos css/js/*.jpg "/staticfiles" para diferenciar las url de proyecto "/staticfiles/css/bootstrap.min.css"
app.use("/staticfiles",express.static('public'));

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: "156sadtasdtdh165fdfn"
}));

app.use("/app",session_middleware);
app.use("/app",app_router);


app.use(bodyParser.json());//para peticiones application/json
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
   console.log(req.session.user_id +" este es el id del user");
   User.find().then( (doc)=>{
   console.log(doc);
     res.render('index');
    },(err)=>{res.send("ha odurrido un error")}
   );

});

app.get('/signup', function(req, res){
 res.render('signup.pug');
});

app.get('/login', function(req, res){
 res.render('login');

});

app.post('/sessions', (req,res)=>{
 User.findOne({email: req.body.email, password: req.body.password},(err,doc)=>{})
 .then((doc)=>{
   console.log(doc);
   console.log(doc._id);
   req.session.user_id=doc._id;
   res.redirect("/app")});
});

app.post("/users",function(req,res){
  var user = new User({
                        email: req.body.email,
                        password: req.body.password,
                        password_confirmation: req.body.password_confirmation,
                        username: req.body.username,
                        name: req.body.name,
                      });

  user.save().then(function(us){
        console.log(us);
        res.send("Guardamos todos los datos");
  }, function(err){
    if(err){
      console.log(String(err));
      res.send("Losentimos no se pudo guardar los datos")
    }
  });
})
app.post('/',function(req, res){
   res.render('form')
 });
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
