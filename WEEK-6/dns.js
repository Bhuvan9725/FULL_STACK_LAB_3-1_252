const dns = require("dns");

let domain = "google.com";

dns.lookup(domain, (err, address) => {
    if (err)
        console.log("Error:", err.message);
    else
        console.log("IP Address:", address);
});