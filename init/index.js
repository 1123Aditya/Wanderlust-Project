const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

main().then((res)=>{
    console.log("Connect to DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/rutvik")
}

const initDb = async  () =>{
    await Listing.deleteMany();
    initdata.data = initdata.data.map((obj) => ({...obj,owner:"6682e1479ca576a1c8609bd6"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initalized");
}
initDb();