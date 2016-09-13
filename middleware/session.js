var User=require('../models/user').User;//import {User} from './models/user';


 module.exports = function(req,res,next){
   if(!req.session.user_id){
       res.redirect("/login");
   }else{
      User.findById(req.session.user_id).then((user)=>{
         console.log(user);
          res.locals={user: user};
          next();
      },(err)=>{
        console.log(err);
        res.redirect("/login");
      });

   }
 }
