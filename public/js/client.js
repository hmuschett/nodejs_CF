var socket= io();

socket.on("new image", (data)=>{
   var dato = JSON.parse(data);
   console.log(dato);
});
