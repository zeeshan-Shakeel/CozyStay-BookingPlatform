
const express =require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync"); // Assuming this utility is correctly defined
const {isLoggedIn}=require("../middleware");
const {isOwner}=require("../middleware");
const listinngController=require("../controller/listings");
let {validateListing}=require("../middleware");

const multer = require("multer");
const {storage}=require("../cloudconfig.js");
const upload = multer({storage});

// Index Route: Get all listings
router.get("/listings", wrapAsync(listinngController.renderIndex));

// Create Route (GET form): Display form to create a new listing
router.get("/listings/create", isLoggedIn ,listinngController.createForm );

// Post Create Route (POST data): Handle form submission for new listing
router.post("/listings"  ,isLoggedIn   ,validateListing, upload.single("listing[image]") ,wrapAsync(listinngController.postForm));


// Edit Route (GET form): Display form to edit an existing listing
router.get("/listings/:id/edit"  , isOwner  ,wrapAsync(listinngController.renderEdit));

// Update Route (PUT data): Handle form submission for updating a listing
router.put("/listings/:id", isOwner,validateListing,upload.single("listing[image]") ,wrapAsync(listinngController.postEdit));

// Show Route (GET individual listing): Display details of a single listing
router.get("/listings/:id", wrapAsync(listinngController.renderShow));

// Delete Route (DELETE listing): Handle deletion of a listing
router.delete("/listings/:id",isLoggedIn ,isOwner ,wrapAsync(listinngController.destroyListing));

module.exports=router;