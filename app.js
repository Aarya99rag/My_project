const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");     // The ./ means "starting from the current directory."If your current file is located at /project/app.js, then ./models/listing.js refers to /project/models/listing.js.
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main()
.then(()=>{
    console.log("Connection Successful");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.listen(8080, ()=>{
    console.log("app listening to port 8080");
});

app.get("/", (req,res)=>{
    res.send("Hi, I am root");
});

// app.get("/testlisting", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the River",
//         price: 1200,
//         location: "Calangute",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// Print all the Listings(apartments,hotels,villas,etc)
app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// create new listing. form to fill in details
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});
// data inserted in db
app.post("/listings", async (req,res)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});

// Print detailed data for location.
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing}); 
});

// Edit Route form
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});
// Update changes in db
app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });   // { ...req.body.listing } creates a new object and spreads (copies) all properties from req.body.listing into this new object.
    res.redirect(`/listings/${id}`);
})

// Destroy Route
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})