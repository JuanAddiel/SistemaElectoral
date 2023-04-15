const express = require("express");
const router = express.Router();
const isAuth =require("../middleware/isAuth");
const CandidatoC = require("../controllers/candidatosController");



router.get("/candidatos", isAuth.isAdmin, CandidatoC.Candidatos);
router.get("/create-candidato", isAuth.isAdmin, CandidatoC.CreateCandidatos);
router.post("/create-candidato", isAuth.isAdmin, CandidatoC.PostCreateCandidatos);
router.get("/edit-candidato/:candidatoId", isAuth.isAdmin, CandidatoC.EditCandidato);
router.post("/edit-candidato", isAuth.isAdmin, CandidatoC.PostEditCandidato);
router.post("/delete-candidato", isAuth.isAdmin, CandidatoC.DeleteCandidato);

module.exports = router;