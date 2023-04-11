const express = require("express");

const autorController = require("../controllers/autorController");

const router = express.Router();


router.get("/login", autorController.GetLogin);
router.post("/login", autorController.PostLogin);
router.post("/logout", autorController.Logout);
router.get("/signup", autorController.GetSignup);
router.post("/signup", autorController.PostSignup);



module.exports = router;
