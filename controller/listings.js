const Listing=require("../Models/listing");
const maptilerGeocoding = require('./maptiler-sdk');

// Replace with your actual API key
const client = maptilerGeocoding('Zru1Uihb5z1Nt4EZaiHh');


module.exports.renderIndex=async (req, res, next) => {
    console.log("Executing /listings (Index) Route"); // Debugging log
    const listings = await Listing.find({});
    res.render("listings/index", { listings });
}


module.exports.createForm=(req, res, next) => {
console.log(req.user);
    console.log("Executing /listings/create (GET Form) Route"); // Debugging log
    res.render("listings/create");
};

module.exports.postForm = async (req, res, next) => {
  const results = await client.forwardGeocode(req.body.listing.location, 1);

  if (results.length === 0) {
    req.flash("error", "Location not found on map.");
    return res.redirect("/listings/create");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.image = {
    url: req.file.path,
    filename: req.file.filename
  };

 let geoo= newListing.geometry = {
    type: "Point",
    coordinates: results[0].coordinates
  };
console.log(geoo);
  await newListing.save();
  req.flash("success", "Listing is Created");
  res.redirect("/listings");
};

module.exports.renderEdit=async (req, res, next) => {
    console.log(`Executing /listings/${req.params.id}/edit (GET Form) Route`); // Debugging log
    let { id } = req.params;
    const listings = await Listing.findById(id);
if(!listings ){
    req.flash("failure","Listing is not available ");
 return res.redirect("/listings")
}

    if (!listings) {
        throw new ExpressError(404, "Listing not found for editing!");
    }

    let originalUrl=listings.image.url;
    let originalImage=originalUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit", { listings,originalImage });
};

module.exports.postEdit=async (req, res, next) => {
    console.log(`Executing /listings/${req.params.id} (PUT) Route`); // Debugging log
    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
    if(typeof req.file !=="undefined"){
let url=req.file.path;
    let filename=req.file.filename;
      listing.image={url,filename};
 await listing.save();
    }
     
    if(!listing ){
    req.flash("failure","Listing is not available ");
return res.redirect("/listings")
}

    if (!listing) {
        throw new ExpressError(404, "Listing not found for updating!");
    }
    req.flash("success","Listing is Successfully Edited")
    res.redirect(`/listings/${id}`);
};

module.exports.renderShow =async (req, res, next) => {
    console.log(`Executing /listings/${req.params.id} (Show) Route`); // Debugging log
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"}
    }).populate("owner");
    if (!listings) {
        req.flash("error","listing Does not Exist");
        return res.redirect("/listings");
    }
   
    console.log(listings)
    res.render("listings/show", { listings });
};

module.exports.destroyListing=async (req, res, next) => {
    console.log(`Executing /listings/${req.params.id} (DELETE) Route`); // Debugging log
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found for deletion!");
    }
     req.flash("success","Listing is Deleted")

    res.redirect("/listings");
}
