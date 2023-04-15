const express = require("express");

const eleccionController = require("../controllers/eleccionController");
const isAuth =require("../middleware/isAuth");
const router = express.Router();

router.get('/elecciones',isAuth.isAdmin, eleccionController.getElecciones);
router.get('/resultados',isAuth.isAdmin, eleccionController.getResultadoOfPuesto);
router.get('/votos/:id',isAuth.isAdmin, eleccionController.getVotos);
router.post('/elecciones/:id',isAuth.isAdmin, eleccionController.postEndEleccion);
router.get('/elecciones-get',isAuth.isAdmin, eleccionController.getStartEleccion);
router.post('/elecciones-post',isAuth.isAdmin, eleccionController.postStartEleccion);

module.exports=router;

