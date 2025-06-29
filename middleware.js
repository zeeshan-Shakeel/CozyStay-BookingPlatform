const Listing=require("./Models/listing")
const Review=require("./Models/review")
const {listingSchema,reviewSchema}=require("./utils/Schema")
const ExpressError=require("./utils/ExpressError")
let isLoggedIn=(req,res,next)=>{ 
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
req.flash("error","Please Login first");
return res.redirect("/login");
    }
next();
};
  
let saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

let isOwner= async(req,res,next)=>{
    let{id}=req.params;
    let listing =await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("failure","you are not the owner of the Listing");
            return res.redirect(`/listings/${id}`)
        
        }
    next();
}

let isAuthor= async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review =await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("failure","you are not the author of the Review");
            return res.redirect(`/listings/${id}`)
        
        }
    next();
}
let validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body
  );
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};
let validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body
  );
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};
module.exports = {
isLoggedIn,
saveRedirectUrl,
isOwner,
isAuthor,
validateListing,
validateReview,
};