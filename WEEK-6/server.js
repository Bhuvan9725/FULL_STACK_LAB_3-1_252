const net= require("net");
const server=net.createServer((socket)=>{
console.log("Client connected ");
socket.write("Welcome to the TCP Server!");
socket.on("end",()=>{
console.log("Client disconnected");
});
});
server.listen(3000,()=>{
console.log("Server is running on port 3000");
});
