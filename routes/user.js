const express=require("express");
const router=express.Router();
const User=require("../Models/user")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controller/user");

router.get("/signUp",userController.renderSignup);

router.post("/signUp",userController.signup)


router.get("/login",userController.renderLogin);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}),userController.login);



router.get("/logOut",userController.logOut);

module.exports=router;