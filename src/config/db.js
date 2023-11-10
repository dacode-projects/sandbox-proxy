const fs = require("fs");
const jsonString = fs.readFileSync("db.json");
const DB = JSON.parse(jsonString);

module.exports = DB;