const candidatos = require('../models/candidatos');
const puestoElectivo = require('../models/puestoElectivo');
const Elecciones = require('../models/elecciones');
const { Op } = require("sequelize");
const Partidos = require('../models/partidos');
const Votos = require('../models/votos');
const candidatoElecciones = require('../models/candidatosElecciones');


exports.getVotos = (req,res,next)=>{
    const eleccionId = req.query.eleccionId;
    const puestoId = req.params.id;

    console.log(puestoId)
    candidatoElecciones.findOne({where:[{eleccioneId:eleccionId, puestoElectivoId:puestoId}]
    })
    .then((result)=>{
        const elec =result.dataValues;
        console.log(elec.votos)
        candidatos.findAll({where:{id:elec.candidatoId}})
        .then((result)=>{
            const candid =result.map(result => result.dataValues);
            res.render('elecciones/votos-list',{
                pageTitle:'Votos',
                candidato:candid,
                voto: elec
            })
        }).catch(err => {
            console.log(err);
        })

    }).catch(err => {
        console.log(err);
    })
}

exports.getResultadoOfPuesto = async (req, res, next)=>{
    const eleccionId = req.query.id;

    const eleccionActiva = await Elecciones.findOne({ where: { id: eleccionId } });
    console.log(eleccionActiva.dataValues)
    // Obtener los IDs de los puestos votados por el usuario en la elección actual
    const votos = await Votos.findAll({ 
        where: { 
            eleccioneId: eleccionActiva.id 
        },
    });
    const votosPuestosIds = votos.map(voto => voto.puestoElectivoId);

    const puesto = await puestoElectivo.findAll(
        { where: { id: votosPuestosIds } 
    })
        .then((resul) => {
            const puestosElectivos = resul.map(result => result.dataValues);

            res.render("elecciones/puesto-list", {
                pageTitle: "Elecciones",
                puestoElectivo: puestosElectivos,
                eleccion: eleccionActiva
            });
        })
        .catch((error) => {
            console.log(error);
        })
    
}

exports.getElecciones = (req, res, next) => {
    Elecciones.findAll()
        .then((result) => {
            const eleccion =result.map(result => result.dataValues);
            Elecciones.findOne({ where: { estado: true } })
                .then((activeEleccion) => {
                    candidatos.findAll({ where: { estado: true } })
                        .then((result) => {
                            const candidato =result.map(result => result.dataValues);
                            puestoElectivo.findAll({ where: { estado: true } })
                                .then((result) => {
                                    const puestoElectivo = result.map(result => result.dataValues);
                                    res.render('elecciones/elecciones-list', {
                                        pageTitle: 'Elecciones',
                                        elecciones:eleccion,
                                        activeEleccion,
                                        candidato: candidato,
                                        puestosElectivos: puestoElectivo,
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                    next(error);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            next(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                    next(error);
                });
        })
        .catch((error) => {
            console.log(error);
            next(error);
        });
};



exports.getStartEleccion = (req, res, next) => {
    res.render("elecciones/elecciones-save", {
        pageTitle: "Elecciones",
        editMode: false
    });
};

exports.postStartEleccion = async (req, res, next) => {
    const { nombre, fechaRealizacion } = req.body;

    try {
        await Elecciones.update({ estado: false }, { where: { estado: true } });
        await Elecciones.create({ nombre, fechaRealizacion, estado: true });
        res.redirect('/elecciones');
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.postEndEleccion = async (req, res, next) => {
    const eleccionId = req.params.id;

    try {
        await Elecciones.update({ estado: false }, { where: { id: eleccionId } });
        res.redirect(`/elecciones`);
    } catch (error) {
        console.log(error

        );
        next(error);
    }
};
