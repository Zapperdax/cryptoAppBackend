const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/userModel");

//**********GET ROUTEs**********

router.get("/user/me", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get("/user/allUsers", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(400).send({ "ERROR:": "No Users In Database" });
    }
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//**********POST ROUTES**********
//new user
router.post("/newUser", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//login
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//logout
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//logout all
router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

//**********Patch Routes**********
//Route For Updating Password When User Has Forgotten Password
router.patch("/user/changePassword", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ "ERROR : ": "No User Found" });
    }
    user.password = req.body.password;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
