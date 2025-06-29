const mongoose=require("mongoose");
const Listing=require("../Models/listing");
const sampleData = require("./data");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
    console.log("Connected");


  } catch (err) {
    console.error("Error:", err);
  } 
}

main();
const initDb=async ()=>{
   await Listing.deleteMany({});
  let sampleDatas= sampleData.map((obj)=>({...obj,owner:"685bd43c1ee78320ea144ee1"}));
   await Listing.insertMany(sampleDatas);
};
initDb();

