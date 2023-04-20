const partidos = require("../models/partidos");

exports.PartidosMain = (req, res, next) => {
     console.log(partidos)
    partidos.findAll().then(result => {
        const Partido = result.map(result => result.dataValues);
        
        res.render("partidos/partidos", {pageTitle: "Partidos", partidos: Partido, homePartido:true, isAdmin: true});
    }).catch(err => {
        console.log("Something went wrong");
    })
    
}
exports.CreatePartidos = (req, res, next) => {
    res.render("partidos/CrearPartidos", {pageTitle: "Crear partido"})
}
exports.PostCreatePartidos = (req, res, next) => {
    const name = req.body.nombre;
    const description = req.body.descripcion;
    const Imagen = req.file;
    const estado = (req.body.estado === 'activo');

    if(!Imagen){
        return res.redirect("/partidos");
    }

    partidos.create({nombre: name, descripcion: description, logo: "/" + Imagen.path, estado: estado}).then(result => {
        res.redirect("/partidos");
    }).catch(err => {
        console.log("ERROR!" + " " + err);
    })
    
}
exports.EditPartidos = (req, res, next) => {
    const Sid = req.params.partID;
    const edit = req.query.edit;

    partidos.findOne({where: {id: Sid}}).then(result => {
        const partido = result.dataValues;
        res.render("partidos/CrearPartidos", {pageTitle: "Editar Partido", editMode: edit, partidos: partido, homePartido:true, isAdmin: true})
    }).catch(err => {
        console.log("There was an error obtaining the values");
    })
}
exports.PostEditPartido = (req, res, next) => {
    const id = req.body.puestoId;
    const name = req.body.nombre;
    const description = req.body.descripcion;
    const logo = req.file;
    const estado = (req.body.estado === 'activo');

    partidos.findOne({where:{id:id}})
    .then((result) => {
        const partido = result.dataValues;
        if (!partido) {
            return res.redirect("/partidos");
        }

        const imagePath = logo ? "/" + logo.path : partido.imagen;
        partidos.update({nombre: name, descripcion: description, logo:imagePath, estado: estado}, {where: {id: id}}).then(result => {
            res.redirect("/partidos");
        }).catch(err => {
            console.log("ERRROR!" + " " + err);
        })
    })

   
}
exports.DeletePartido = (req, res, next) => {
    const DiD = req.body.partidoId;
    partidos.findByPk(DiD)
    .then((resu) => {
        return resu.destroy();
    })
    .then((result) => {
        res.redirect("/partidos");
    })
    .catch((err) => {
        console.log(err);
    });
}