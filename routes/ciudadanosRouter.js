const express = require("express");
const path = require("path");

const router = express.Router();
const isAuth =require("../middleware/isAuth");
const ciudadanosController = require("../controllers/CiudadanosController");

router.get("/ciudadanos",isAuth.isAdmin, ciudadanosController.GetCiudadanos);
router.get("/ciudadanos-save",isAuth.isAdmin, ciudadanosController.GetSaveCiudadanos);
router.post("/ciudadanos-save",isAuth.isAdmin, ciudadanosController.PostSaveCiudadanos);
router.get("/ciudadanos-update/:id",isAuth.isAdmin, ciudadanosController.GetUpdateCiudadano);
router.post("/ciudadanos-update",isAuth.isAdmin, ciudadanosController.PostUpdateCiudadano);
router.post('/ciudadanos-delete',isAuth.isAdmin, ciudadanosController.DeleteCiudadano);


module.exports = router;