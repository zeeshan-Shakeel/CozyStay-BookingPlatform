
const Listing=require("../Models/listing")
const Review=require("../Models/review");

module.exports.renderIndex=async (req,res,next)=>{
    console.log(req.params)
    let{id}=req.params;
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
newReview.author=req.user._id;
console.log(newReview);
listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
req.flash("success","Review is Successfully Posted")
    console.log("its working");
    res.redirect(`/listings/${id}`)
};

module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Sucessfully Deleted")
    res.redirect(`/listings/${id}`)
  };