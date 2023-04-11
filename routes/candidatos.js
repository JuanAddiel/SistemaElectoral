const express = require("express");
const router = express.Router();

const CandidatoC = require("../controllers/candidatosController");

//esto va en la ruta del home
router.get("/", CandidatoC.Home);
//ruta de los puestos
router.get("/puestos", CandidatoC.Puestos);
//ruta de creacion de puestos
router.get("/create-puesto", CandidatoC.CreatingPuesto);
//post de la creacion de puestos
router.post("/create-puesto", CandidatoC.PostCreatePuesto);
//ruta de edicion de puestos
router.get("/edit-puesto/:puestoId", CandidatoC.EditPuesto);
//post de la edicion de puestos
router.post("/edit-puesto", CandidatoC.PostEditPuesto);
//post de elimiar el puesto
router.post("/delete-puesto", CandidatoC.DeletePuesto);
//ruta de los candidatos
router.get("/candidatos", CandidatoC.Candidatos);
//ruta de creacion de candidatos
router.get("/create-candidato", CandidatoC.CreateCandidatos);
//post de la creacion de candidatos
router.post("/create-candidato", CandidatoC.PostCreateCandidatos);
//ruta de edicion de candidato
router.get("/edit-candidato/:candidatoId", CandidatoC.EditCandidato);
//post de edicion de candidatos
router.post("/edit-candidato", CandidatoC.PostEditCandidato);
//post de eliminar candidato
router.post("/delete-candidato", CandidatoC.DeleteCandidato);

module.exports = router;