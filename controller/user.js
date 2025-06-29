
const User=require("../Models/user");


module.exports.renderSignup=(req,res)=>{
    res.render("listings/signUp")
}


module.exports.signup=async(req,res)=>{
    try{
let{username,email,password}=req.body;
let newUser=new User({username,email});
let registerUser=await User.register(newUser,password);
req.login(registerUser,(err)=>{
    if(err){
       return next(err);
    }
req.flash('success',"Successfully registered");
res.redirect("/listings");

})
    }
    catch(err){
         req.flash("error",err.message)
        res.redirect("/signUp");
       
    }

};

module.exports.renderLogin=(req,res)=>{
    res.render("listings/login")
}


module.exports.login=async(req,res)=>{

    req.flash("success","Welcome Back to the CozySta y");
    let newUrl=res.locals.redirectUrl || "/listings";
    res.redirect(newUrl)
};

module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
    })
   
    res.redirect("/listings");
     req.flash("success","Logout Successfull");
}