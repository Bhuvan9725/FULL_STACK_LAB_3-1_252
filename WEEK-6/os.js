const os = require("os");

console.log("Platform:", os.platform());
console.log("Architecture:", os.arch());
console.log("CPU Information:", os.cpus());
console.log("Total Memory:", os.totalmem());
console.log("Free Memory:", os.freemem());