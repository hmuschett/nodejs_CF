var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var sexo_values=["m","h"];
var email_match= [/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i,"Coloca un direccion de correo valida"];



var user_schema= new mongoose.Schema({
  name:{type:String, required: "el nombre el obligatorio"},
  username:{type:String, required:false, maxlength:[25,"el username es muy grade"]},
  password:{
    type:String,
    minlength:[8,"el pass es muiy corto"],
    validate:{
       validator:(p)=>{if(this.password_confirmation==p) return true},
       message:"los pass tienen que ser =s"
     }
   },
  age:{type:Number, min:[5, "tiene que ser mayor de edad"],max:120},
  email:{type:String, required:true, match:email_match},
  date_of_brith:Date,
  sexo:{type: String, enum:{values: sexo_values, message:"opción no valida"}}
});


user_schema.virtual("password_confirmation")
.get(()=>{this.p_c;})
.set((password)=>{this.p_c= password});


let User = mongoose.model("User",user_schema);

//export { User };
module.exports.User=User;
