const express = require("express");
const path = require("path");

const router = express.Router();

const ciudadanosController = require("../controllers/CiudadanosController");

router.get("/ciudadanos", ciudadanosController.GetCiudadanos);
router.get("/ciudadanos-save", ciudadanosController.GetSaveCiudadanos);
router.post("/ciudadanos-save", ciudadanosController.PostSaveCiudadanos);
router.get("/ciudadanos-update/:documentoIdentidad", ciudadanosController.GetUpdateCiudadano);
router.post("/ciudadanos-update/:documentoIdentidad", ciudadanosController.PostUpdateCiudadano);
router.post('/ciudadanos-delete/:documentoIdentidad', ciudadanosController.DeleteCiudadano);


module.exports = router;