const express = require("express");
const flash = require('express-flash');
const passport = require('passport');
const connectEnsureLoggedIn = require('connect-ensure-login');

const router = express.Router();

const User = require("../models/UserModel");

const fileTypes = /jpeg|jpg|gif|png/;

router.get("/login", connectEnsureLoggedIn.ensureLoggedOut("/"),(req, res) => {
  res.render("auth/login");
})

router.post("/login", connectEnsureLoggedIn.ensureLoggedOut("/"), passport.authenticate('local', {
  successFlash: true,
  successMessage: "You have logged in successfully!",
  successRedirect: "/",
  failureFlash: true,
  failureMessage: "Email or password is incorrect",
  failureRedirect: "/login"
}))

router.get("/signup", connectEnsureLoggedIn.ensureLoggedOut("/"), (req, res) => {
  res.render("auth/signup");
})

router.post("/signup", connectEnsureLoggedIn.ensureLoggedOut("/"), async (req, res) => {
  try {
    let user = await User.findOne({email: req.body.email});
    if (user) {
      req.flash("error", "User with that email already exists");
      res.status(422).render("auth/signup");
    }else {
      User.register(req.body, req.body.password, (err) => {
        if(err) {
          throw new Error();
        }
        req.flash("success", "You have successfully signed up!!")
        res.redirect("/login");
      })
    }
  }catch(e) {
    console.error(e);
  }
})

router.get("/updateUserProfile/:id", connectEnsureLoggedIn.ensureLoggedIn("/login"), async(req, res) => {
  try{
    let user = await User.findById(req.params.id);
    res.render("auth/updateProfile", {user});
  }catch(e) {
    console.error(e)
  }
})

router.post("/updateUserProfile", connectEnsureLoggedIn.ensureLoggedIn('/login'), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.query.id, req.body);
    res.redirect("/userposts")
  } catch(e){
    console.err(e)
  }
})

router.post("/userprofilepicture", connectEnsureLoggedIn.ensureLoggedIn("/"), async (req, res) => {
  try{
    if(req.files == null || !(fileTypes.test(req.files.userimage.mimetype.toLowerCase()))) throw new Error();

    let finalObj = {};
    finalObj.userimage = new Buffer.from(req.files.userimage.data, 'base64');
    finalObj.userimagetype = req.files.userimage.mimetype;

    await User.findByIdAndUpdate(req.user._id, finalObj);

    res.redirect("/userposts")
  }catch(e) {
    console.error(e);
    req.flash("error", "Something went wrong please try again")
    res.redirect("/userposts")
  }
})

router.delete("/logout", connectEnsureLoggedIn.ensureLoggedIn("/login"),(req, res) => {
  req.logOut();
  res.redirect("/login");
})

module.exports = router;