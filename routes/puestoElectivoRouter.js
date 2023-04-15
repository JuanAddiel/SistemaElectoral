const express = require("express");
const path = require("path");

const router = express.Router();

const puestoElectivoController = require("../controllers/PuestoElectivoController");
const isAuth =require("../middleware/isAuth");

router.get("/puestoElectivo",isAuth.isAdmin,puestoElectivoController.GetPuestoElectivo);
router.get("/puestoElectivo-save",isAuth.isAdmin, puestoElectivoController.GetSavePuestoElectivo);
router.post("/puestoElectivo-save",isAuth.isAdmin, puestoElectivoController.PostSavePuestoElectivo);
router.get("/puestoElectivo-update/:id",isAuth.isAdmin,puestoElectivoController.GetUpdatePuestoElectivo);
router.post("/puestoElectivo-update/:id",isAuth.isAdmin, puestoElectivoController.PostUpdatePuestoElectivo);
router.post('/puestoElectivo-delete/:id',isAuth.isAdmin, puestoElectivoController.PostDeletePuestoElectivo);

module.exports = router;