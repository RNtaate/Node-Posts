const express = require("express");
const flash = require('express-flash');

const router = express.Router();

const User = require("../models/UserModel");

router.get("/login", (req, res) => {
  res.render("auth/login");
})

router.get("/signup", (req, res) => {
  res.render("auth/signup");
})

router.post("/signup", async (req, res) => {
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

module.exports = router;