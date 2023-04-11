const express = require("express");
const router = express.Router();

const PartidoController = require("../controllers/partidoController");

router.get("/partidos", PartidoController.PartidosMain);
router.get("/create-partido", PartidoController.CreatePartidos);
router.post("/create-partido", PartidoController.PostCreatePartidos);   
router.get("/edit-partido/:partID", PartidoController.EditPartidos);
router.post("/edit-partido", PartidoController.PostEditPartido);
router.post("/delete-partido", PartidoController.DeletePartido);

module.exports = router;