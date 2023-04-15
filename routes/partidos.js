const express = require("express");
const router = express.Router();

const PartidoController = require("../controllers/partidoController");
const isAuth =require("../middleware/isAuth");

router.get("/partidos",isAuth.isAdmin, PartidoController.PartidosMain);
router.get("/create-partido",isAuth.isAdmin, PartidoController.CreatePartidos);
router.post("/create-partido",isAuth.isAdmin, PartidoController.PostCreatePartidos);   
router.get("/edit-partido/:partID",isAuth.isAdmin, PartidoController.EditPartidos);
router.post("/edit-partido",isAuth.isAdmin, PartidoController.PostEditPartido);
router.post("/delete-partido",isAuth.isAdmin, PartidoController.DeletePartido);

module.exports = router;