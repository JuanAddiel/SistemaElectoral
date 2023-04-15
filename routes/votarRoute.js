const express = require("express");
const path = require("path");

const router = express.Router();

const votoController = require("../controllers/votoController");
const isAuth =require("../middleware/isAuth");

router.get("/votar",isAuth.isCitizien,isAuth.isVoted, votoController.getEleccionesActive);
router.get("/votarPuestos",isAuth.isCitizien,isAuth.isVoted, votoController.getPuestoElectivosActive);
router.get("/candidatosVoto/:id",isAuth.isCitizien,isAuth.isVoted,  votoController.getCandidatosActive);
router.post("/save-voto",isAuth.isCitizien,isAuth.isVoted,  votoController.postVotar);

module.exports = router;