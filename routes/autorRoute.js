const express = require("express");

const autorController = require("../controllers/autorController");

const router = express.Router();


router.get("/login", autorController.GetLogin);
router.post("/login", autorController.PostLogin);
router.post("/logout", autorController.Logout);
router.get("/signup", autorController.GetSignup);
router.post("/signup", autorController.PostSignup);
router.get("/reset", autorController.GetReset);
router.post("/reset", autorController.PostReset);
router.get("/reset/:token", autorController.GetNewPassword);
router.post("/new-password", autorController.PostNewPassword);


module.exports = router;
