const Voto = require('../models/votos');
const CandidatoEleccion = require('../models/candidatosElecciones')
const PuestoElectivo = require('../models/puestoElectivo');
const Candidato = require('../models/candidatos');
const Partidos = require('../models/partidos');
const eleccion = require('../models/elecciones');
const ciudadano = require('../models/ciudadanos');
const usuario = require('../models/usuarios');
const {Op} =require('sequelize');


exports.getEleccionesActive = (req, res, next) => {
    eleccion.findAll({
        where: {
            estado: true
        }
    })
        .then((result) => {
            const eleccion = result.map((result) => result.dataValues);
            res.render("votar/votar", {
                pageTitle: "Votar",
                eleccion: eleccion
            });
        })
        .catch((error) => {
            console.log(error);
        });
}
exports.getPuestoElectivosActive = async (req, res, next) => {
    const eleccionActiva = await eleccion.findOne({ where: { estado: true } });
    const userId = req.session.user.id;

    // Obtener los IDs de los puestos votados por el usuario en la elección actual
    const votos = await Voto.findAll({ 
        where: { 
            usuarioId: userId, 
            eleccioneId: eleccionActiva.id 
        },
        attributes: ['puestoElectivoId'] 
    });
    const votosPuestosIds = votos.map(voto => voto.puestoElectivoId);
    console.log(votosPuestosIds)
    // Obtener los puestos electivos activos que aún no han sido votados por el usuario
    PuestoElectivo.findAll({
        where: {
            estado: true,
            id: {
                [Op.notIn]: votosPuestosIds // Excluir los puestos votados por el usuario
            }
        },
        include: [{
            model: Candidato,
            where: {
                estado: true
            },
        }]
    })
        .then((puestosElectivos) => {
            const puestosElectivo = puestosElectivos.filter((puesto) => puesto.candidatos.length > 1).map((result) => result.dataValues);
            if(puestosElectivo.length < 1)
            {
                req.flash("errors", "Aun no hay candidatos activos, en los puestos");
                                res.redirect("/votar");
            }

            
            res.render("votar/votar-puestos", {
                pageTitle: "Votar",
                puestoElectivo: puestosElectivo,
                eleccion: eleccionActiva
            });
        })
        .catch((error) => {
            console.log(error);
        });
}



exports.getCandidatosActive = (req, res, next) => {
    const id = req.params.id;
    const eleccionId = req.query.eleccionId;

    eleccion.findOne({
        where: {
            id: eleccionId
        },
    })
        .then((result) => {
            const Elec = result.dataValues;

            Candidato.findAll({
                where: {
                    puestoElectivoId: id,
                    estado: true
                },
                include: [{
                    model: PuestoElectivo,
                },
                {
                    model: Partidos
                }],
            })
                .then((result) => {
                    const candi = result.map((result) => result.dataValues);
                    console.log(candi)
                    res.render("votar/votar-candidato", {
                        pageTitle: "Votar",
                        candidato: candi,
                        eleccion: Elec
                    });
                })
                .catch((error) => {
                    console.log(error);

                }).catch((error) => {
                    console.log(error);
                })
        });
}

exports.postVotar = async (req, res, next) => {
    try {
        const idCandidato = req.body.idCandidato;
        const idCiudadano = req.session.user ? req.session.user.ciudadanoId : null;
        const idEleccion = req.body.idEleccion;
        const idPuesto = req.body.idPuesto;
        const idUsuario = req.session.user.id;
        // Crea el voto en la tabla de Voto
        await Voto.create({
            candidatoId: idCandidato,
            ciudadanoId: idCiudadano,
            eleccioneId: idEleccion,
            puestoElectivoId: idPuesto,
            usuarioId: idUsuario,
        });

        // Incrementa en 1 el número de votos del candidato en la elección
        const candidatoEleccion = await CandidatoEleccion.findOne({
            where: {
                candidatoId: idCandidato,
                eleccioneId: idEleccion,
                puestoElectivoId: idPuesto
            },
        });
        if (!candidatoEleccion) {
            // Si no existe un registro para el candidato en la elección, lo crea con 1 voto
            await CandidatoEleccion.create({
                candidatoId: idCandidato,
                eleccioneId: idEleccion,
                puestoElectivoId: idPuesto,
                votos: 1,
            });
        } else {
            // Si ya existe un registro para el candidato en la elección, incrementa en 1 el número de votos
            await candidatoEleccion.increment('votos');
        }

        // Redirige al usuario a la página de votación
        res.redirect('/votar');
    } catch (error) {
        console.error(error);
        next(error);
    }
};