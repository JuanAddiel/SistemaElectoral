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
            homeCandidato: true
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
                hasPuestos: puesto.length > 0
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
            res.render("candidatos/CrearCandidato", { pageTitle: "Editar Candidato", editMode: edit, candidatos: candidato, partidos: partido, puestos: puesto, hasPartidos: partido.length > 0,
            hasPuestos: puesto.length > 0})
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
    const pic = req.body.Cfoto;
    const elementID = req.body.puestoId;
    const estado = req.body.estado === "activo";
    console.log(estado)

    candidatos.update({ nombre: name, apellido: lastname, puesto: position, partidoId: party, foto: pic, estado: estado }, { where: { id: elementID } }).then(result => {
        return res.redirect("/candidatos");
    }).catch(err => {
        console.log(err)
    })
}


exports.DeleteCandidato = (req, res, next) => {
    const id = req.body.candidatoId;
    const name = req.body.Cnombre;
    const lastname = req.body.Capellido;
    const position = req.body.Cpuesto;
    const party = req.body.Cpartido;
    const pic = req.body.Cfoto;

    candidatos.findOne({ where: { id: id } }).then(result => {
        const puesto = result.dataValues;
        let estado = puesto.estado;


        candidatos.update({ nombre: name, apellido: lastname, puesto: position, partido: party, foto: pic, estado: false }, { where: { id: id } })
            .then(result => {
                if (!estado) {
                    candidatos.destroy({ where: { id: id } }).then(result => {
                        return res.redirect("/candidatos");
                    }).catch(err => {
                        console.log("Something went wrong");
                    })
                }
                return res.redirect("/candidatos");
            })
            .catch(err => {
                console.log("There was an error");
            })
    }).catch(err => {
        console.log("ERROR! " + err);
    })
}

