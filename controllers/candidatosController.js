// tabla de puestos electivos
const puestos = require("../models/puestoElectivo");
// tabla de candidatos
const partidos = require("../models/partidos");
const candidatos = require("../models/candidatos");
const PuestoElectivo = require("../models/puestoElectivo");



//funcionalidad de los candidatos
exports.Candidatos = (req, res, next) => {
    candidatos.findAll({ include: [{ model: partidos }, { model: puestos }] }).then(result => {
        const candidato = result.map(result => result.dataValues);

        res.render("candidatos/candidatosMain", {
            pageTitle: "Candidatos",
            candidatos: candidato,
            hasCandidatos: candidato.length > 0,
            homeCandidato: true,
            isAdmin: true
        });
    }).catch(err => {
        console.log("Something went wrong");
    })


}
exports.CreateCandidatos = (req, res, next) => {
    PuestoElectivo.findAll({where: {estado:1}}).then(result => {
        const puesto = result.map(result => result.dataValues);
        partidos.findAll({where: {estado:1}}).then(result => {
            const partido = result.map(result => result.dataValues);
            res.render("candidatos/CrearCandidato", {
                pageTitle: "Crear candidato",
                partidos: partido,
                puestos: puesto,
                editMode: false,
                homeCandidato: true,
                hasPartidos: partido.length > 0,
                hasPuestos: puesto.length > 0,
                isAdmin: true
            });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })

}
exports.PostCreateCandidatos = (req, res, next) => {
    const name = req.body.Cnombre;
    const lastname = req.body.Capellido;
    const Puestos = req.body.Puestos;
    const party = req.body.Partidos;
    const foto = req.file;
    const estado = (req.body.estado === 'activo');


    if (!foto) {
        return res.redirect("/candidatos");
    }

    //puesto y partido deben ser reemplazodis con los valores reales
    candidatos.create({ nombre: name, apellido: lastname, puestoElectivoId: Puestos, partidoId: party, foto: "/" + foto.path, estado: estado })
        .then(result => {
            res.redirect("/candidatos");
        }).catch(err => {
            console.log("ERROR! " + err);
        })



}
exports.EditCandidato = (req, res, next) => {
    const candId = req.params.candidatoId;
    const edit = req.query.edit;

    candidatos.findOne({ where: { id: candId } }).then(result => {
        const candidato = result.dataValues;
        partidos.findAll().then(result => {
            const partido = result.map(result => result.dataValues);
            PuestoElectivo.findAll({where: {estado:1}}).then(result => {
                const puesto = result.map(result => result.dataValues);
            res.render("candidatos/CrearCandidato", { homeCandidato:true,pageTitle: "Editar Candidato", editMode: edit, candidatos: candidato, partidos: partido, puestos: puesto, hasPartidos: partido.length > 0,
            hasPuestos: puesto.length > 0, isAdmin: true})
        }).catch(err => {
            console.log(err)
        })
        
    }).catch(err => {
        console.log(err)
    })
    })
}
exports.PostEditCandidato = (req, res, next) => {
    const name = req.body.Cnombre;
    const lastname = req.body.Capellido;
    const position = req.body.Cpuesto;
    const party = req.body.Partidos;
    const foto = req.file;
    const elementID = req.body.id;
    const estado = req.body.estado === "activo";
    candidatos.findOne({ where: { id: elementID } })
    .then((result) => {
        const candidato = result.dataValues;
        if (!candidato) {
            return res.redirect("/candidatos");
        }
        const imagePath = foto ? "/" + foto.path : candidato.imagen; // operador ternario    })
        candidatos.update({ nombre: name, apellido: lastname, puesto: position, partidoId: party, foto:imagePath, estado: estado }, {
            where: {
                id: elementID
            }
        })

            .then((result) => {
                res.redirect("/candidatos");
            })
            .catch((err) => {
                console.log(err);
            });
    })

}


exports.DeleteCandidato = (req, res, next) => {
    const id = req.body.candidatoId;
    candidatos.destroy({
        where: {
            id: id
        }
    })
        .then((result) => {
            res.redirect("/candidatos");
        })
        .catch((err) => {
            console.log(err);
        });
}

