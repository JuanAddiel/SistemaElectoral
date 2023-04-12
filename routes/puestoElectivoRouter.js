const express = require("express");
const path = require("path");

const router = express.Router();

const puestoElectivoController = require("../controllers/PuestoElectivoController");

router.get("/puestoElectivo", puestoElectivoController.GetPuestoElectivo);
router.get("/puestoElectivo-save", puestoElectivoController.GetSavePuestoElectivo);
router.post("/puestoElectivo-save", puestoElectivoController.PostSavePuestoElectivo);
router.get("/puestoElectivo-update/:id", puestoElectivoController.GetUpdatePuestoElectivo);
router.post("/puestoElectivo-update/:id", puestoElectivoController.PostUpdatePuestoElectivo);
router.post('/puestoElectivo-delete/:id', puestoElectivoController.PostDeletePuestoElectivo);

module.exports = router;