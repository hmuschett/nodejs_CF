
var express = require('express');
var http = require('http');
//para poder leer parametrosr que vienes en el cuerpo de la peticion
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var session=require("express-session")
//var cookieSession = require('cookie-session');
//este middleware es para subir archibos al serbidor el fomulario tiene que
// la atributo enctype="multipart/form-data"
var formidable = require('express-formidable');

var User=require('./models/user').User;//import {User} from './models/user';

var app_router = require('./app_router');//import {app_router} from './app_router';
var methodOverride = require('method-override');
var session_middleware = require('./middleware/session');
mongoose.connect("mongodb://localhost/datos");

var redisStore = require('connect-redis')(session);
var realtime = require('./realtime');

var sessionMilddlaware= session({
 secret: 'este es mi clave secreta',
 resave: false, // don't save session if unmodified
 saveUninitialized: false, // don't create session until something stored
 store: new redisStore()
 });

var app = express();
var server = http.Server(app);

realtime(server, sessionMilddlaware);

app.use(sessionMilddlaware);// super importante para que las ssesiones funciones con redis
app.set('view engine', 'pug');
//app.set('view engine', 'jade');
// si la carpeta de llama views la coge por defecto y no hace falta la linea de abajo
app.set('views', './viewstr');
// para la config de heroku
app.set('port', (process.env.PORT || 3000));
//para poder subir archivos al serevidor
app.use(formidable.parse({
  keepExtensions: true
}));
//para servir los archivos estaticos css/js/*.jpg "/staticfiles" para diferenciar las url de proyecto "/staticfiles/css/bootstrap.min.css"
app.use("/staticfiles",express.static('public'));
app.use(methodOverride("_method"))

// app.use(cookieSession({
//   // name y keys son campos abligatorios
//   name:"cookie-session",
//   keys: ["llave1", "llane 2"]
// }));

//cuando se usa session sin redis
 // app.use(session({
 //    resave: false,  //don't save session if unmodified
 //   saveUninitialized: false,  //don't create session until something stored
 //   secret: "156sadtasdtdh165fdfn"
 // }));

app.use(bodyParser.json());//para peticiones application/json
app.use(bodyParser.urlencoded({extended: true}));

//tiene que estar de bajo del app.use(session) y app.use(bodyParser) si no, no lo reconoce
app.use("/app",session_middleware);
app.use("/app",app_router);

app.get('/', function (req, res) {
   User.find().then( (doc)=>{
     res.render('index');
    },(err)=>{res.send("ha odurrido un error")}
   );
});

app.get("/logout",(req, res)=>{
 req.session.destroy();
 res.redirect("/");
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
server.listen(app.get('port'), function () {
  console.log('Example app listening on port 3000!');
});
