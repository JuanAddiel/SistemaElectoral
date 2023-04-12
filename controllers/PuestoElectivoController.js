const Sequelize = require("../context/appContext");
const PuestoElectivo = require("../models/puestoElectivo");

exports.GetPuestoElectivo = (req, res, next) => {
    PuestoElectivo.findAll()
        .then((result) => {
            const puestoElectivo = result.map((result) => result.dataValues);

            res.render("puestoElectivo/puestoElectivo-list", {
                pageTitle: "Puesto Electivo",
                puestoElectivoActi: true,
                puestoElectivo: puestoElectivo,
                hasPuestoElectivo: puestoElectivo.length > 0
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetSavePuestoElectivo = (req, res, next) => {
    res.render("puestoElectivo/puestoElectivo-save", {
        pageTitle: "Administra Puesto Electivo",
    });
};

exports.PostSavePuestoElectivo = (req, res, next) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const estado = (req.body.estado === 'activo');

    const puestoElectivo = new PuestoElectivo({
        id,
        nombre,
        descripcion,
        estado
    });
    puestoElectivo.save().then(result => {
        res.redirect("/puestoElectivo");
        console.log(result);
    }).catch(error => {
        console.log(error);
    })
};

exports.GetUpdatePuestoElectivo = (req, res, next) => {
    const edit = req.query.edit;
    const id = req.params.id;

    if (!edit) {
        return res.redirect("/puestoElectivo");
    }
    PuestoElectivo.findOne({
            where: {
                id: id
            }
        })
        .then((result) => {
            const puestoElectivo = result.dataValues;

            if (!puestoElectivo) {
                return res.redirect("/puestoElectivo");
            }

            res.render("puestoElectivo/puestoElectivo-save", {
                pageTitle: "Editar Puesto Electivo",
                PuestoElectivo: puestoElectivo,
                editMode: edit,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.PostUpdatePuestoElectivo = (req, res, next) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const estado = req.body.estado === "activo";

    PuestoElectivo.update({
            nombre,
            descripcion,
            estado,
        }, {
            where: {
                id: id,
            },
        })
        .then(() => {
            res.redirect("/puestoElectivo");
        })
        .catch((err) => {
            console.log(err);
        });
};



exports.PostDeletePuestoElectivo = (req, res, next) => {
    const id = req.params.id;
    PuestoElectivo.destroy({
            where: {
                id: id
            }
        })
        .then((result) => {
            res.redirect("/puestoElectivo");
        })
        .catch((err) => {
            console.log(err);
        });
}