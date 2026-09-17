const path = require("path");

let filePath = "C:\\Users\\Lasya\\Documents\\test.txt";

console.log("Directory:", path.dirname(filePath));
console.log("File Name:", path.basename(filePath));
console.log("Extension:", path.extname(filePath));
console.log("Normalized Path:", path.normalize(filePath));