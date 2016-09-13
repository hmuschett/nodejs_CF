

module.exports = function (server, sessionMilddlaware) {
  var io = require('socket.io')(server);
  var redis = require('redis');

  var client= redis.createClient();
  client.subscribe("imagenes");

  io.use((socket,next)=>{
    sessionMilddlaware(socket.request, socket.request.res, next)
  });
client.on("message", (channel,  message)=>{
  if(channel =="imagenes"){
    io.emit("new image", message)
  }
});

  io.sockets.on("connection", socket=>{
    console.log(socket.request.session.user_id);

  });
}
