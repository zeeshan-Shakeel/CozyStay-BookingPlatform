const express =require("express");
const router=express.Router();
const {reviewSchema}=require("../utils/Schema");
const {isAuthor}=require("../middleware");
const wrapAsync = require("../utils/wrapAsync"); // Assuming this utility is correctly defined
const { isLoggedIn } = require("../middleware");
const listingController=require("../controller/reviews");
let {validateReview}=require("../middleware")

//Review Route
router.post("/listings/:id/reviews",isLoggedIn ,validateReview, wrapAsync(listingController.renderIndex))
//Review Delete Route Handle
router.delete("/listings/:id/reviews/:reviewId",isAuthor ,listingController.destroyReview)
module.exports=router;