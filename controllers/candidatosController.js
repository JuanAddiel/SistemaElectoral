// tabla de puestos electivos
const puestos = require("../models/puestoElectivo");
const partido = require("../models/partidos");
// tabla de candidatos
const candidato = require("../models/candidatos");


//funcionalidad de los puestos
exports.Home = (req, res, next) => {
    res.render("eleccion/home", {pageTitle: "Home"})
}

exports.getCandidato = (req, res, next) => {
    candidato.findAll({ include: [{ model: partido }, { model: puestos }] })
    .then((result) => {
        const candidatos = result.map((result) => result.dataValues);
        res.render("candidatos/candidatosMain", {
            pageTitle: "Candidatos",
            homeCandidatos: true,
            candidatos: candidatos,
            hasCandidatos: candidatos.length > 0
        });
    })
    .catch((err) => {
        console.log(err);
    })
   
}


exports.getCreateCandidato =(req,res,next)=>{
    partido.findAll().then(result => {
        const partidos = result.map(result => result.dataValues);
        puestos.findAll().then(result => {
            const puestos = result.map(result => result.dataValues);
            res.render("candidatos/CrearCandidato", {
                pageTitle: "Crear Candidato",
                homeCandidatos: true,
                partidos: partidos,
                puestos: puestos,
                candidatos: candidato,
                editMode: false,
                hasCandidatos: candidato.length > 0,
                hasPartidos: partidos.length > 0,
                hasPuestos: puestos.length > 0
            });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}


exports.PostCreatePuesto = (req, res, next) => {

    
}
exports.EditPuesto = (req, res, next) => {

    const edit = req.query.edit;
    const id = req.params.puestoId;

    puestos.findOne({where: {id: id}}).then(result => {
        const puesto = result.dataValues;
        res.render("candidatos/CrearPuesto", {pageTitle: "Editar puesto", editMode: edit, puestos: puesto})
    }).catch(err => {
        console.log("Something went wrong")
    })
    
}
exports.PostEditPuesto = (req, res, next) => {
    const puesId = req.body.puestoId;

    const name = req.body.nombre;
    const description = req.body.descripcion;

    puestos.update({nombre:name, descripcion: description},{where: {id: puesId}}).then(result => {
        return res.redirect("/puestos");
    }).catch(err => {
        console.log("There was an error");
    })
}
exports.DeletePuesto = (req, res, next) => {
    const PiD = req.body.puestoId;

    const name = req.body.nombre;
    const description = req.body.descripcion;

    puestos.findOne({where: {id: PiD}}).then(result => {
        const puesto = result.dataValues;
        let estado = puesto.estado;

        
        puestos.update({nombre: name, descripcion: description, estado: false}, {where: {id: PiD}})
        .then(result =>{
            if(!estado){
                puestos.destroy({where: {id: PiD}}).then(result => {
                    return res.redirect("/puestos");
                }).catch(err => {
                    console.log("There was an error deleting the element");
                })
                
            }
            return res.redirect("/puestos"); 
        })
        .catch(err => {
            console.log("There was an error changing the data");
        })
            
        
        
    }).catch(err => {
        console.log(err);
    })

    

}
//funcionalidad de los candidatos
exports.Candidatos = (req, res, next) => {
    
    res.render("candidatos/candidatosMain", {pageTitle: "Candidatos"});
    
}
exports.CreateCandidatos = (req, res, next) => {
    res.render("candidatos/CrearCandidato", {pageTitle: "Crear candidato"});
}
exports.PostCreateCandidatos = (req, res, next) => {
    const name = req.body.Cnombre;
    const lastname = req.body.Capellido;
    const position = req.body.Cpuesto;
    const party = req.body.Cpartido;
    const pic = req.body.Cfoto;

    //puesto y partido deben ser reemplazodis con los valores reales
    candidatos.create({nombre: name, apellido: lastname, puesto: position, partido: party, foto: pic, estado: true}).then(result => {
        res.redirect("/candidatos");
    }).catch(err => {
        console.log("ERROR! " + err);
    })

    
}
exports.EditCandidato = (req, res, next) => {
    const candId = req.params.candidatoId;
    const edit = req.query.edit;

    console.log(candId + edit );
    candidatos.findOne({where: {id: candId}}).then(result => {
        const candidato = result.dataValues;
        res.render("candidatos/CrearCandidato", {pageTitle: "Editar Candidato", editMode: edit, candidatos: candidato})
    }).catch(err => {
        console.log(err)
    })

}
exports.PostEditCandidato = (req, res, next) => {
    const name = req.body.Cnombre;
    const lastname = req.body.Capellido;
    const position = req.body.Cpuesto;
    const party = req.body.Cpartido;
    const pic = req.body.Cfoto;
    const elementID = req.body.puestoId;

    candidatos.update({nombre: name, apellido: lastname, puesto: position, partido: party, foto: pic, estado: true}, {where: {id: elementID}}).then(result => {
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

    candidatos.findOne({where: {id: id}}).then(result => {
        const puesto = result.dataValues;
        let estado = puesto.estado;

        
        candidatos.update({nombre: name, apellido: lastname, puesto: position, partido: party, foto: pic, estado: false}, {where: {id: id}})
        .then(result =>{
            if(!estado){
                candidatos.destroy({where: {id: id}}).then(result => {
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

