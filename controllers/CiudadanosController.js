const Sequelize = require("../context/appContext");
const Ciudadanos = require("../models/ciudadanos");


exports.GetCiudadanos = (req, res, next) => {
    Ciudadanos.findAll()
        .then((result) => {
            const ciudadano = result.map((result) => result.dataValues);

            res.render("ciudadanos/ciudadanos-list", {
                pageTitle: "Ciudadano",
                ciudadanoActi: true,
                ciudadano: ciudadano,
                hasCiudadano: ciudadano.length > 0
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetSaveCiudadanos = (req, res, next) => {
    res.render("ciudadanos/ciudadanos-save", {
        pageTitle: "Administra ciudadanos",
    });
};


exports.PostSaveCiudadanos = (req, res, next) => {
    const documentoIdentidad = req.body.documentoIdentidad;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const estado = (req.body.estado === 'activo');

    Ciudadanos.create({
        documentoIdentidad: documentoIdentidad,
        nombre: nombre,
        apellido: apellido,
        email: email,
        estado: estado
    }).then(result => {
        res.redirect("/ciudadanos");
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
};

exports.GetUpdateCiudadano = (req, res, next) => {
    const edit = req.query.edit;
    const Ciudadanoid = req.params.id;

    if (!edit) {
        return res.redirect("/ciudadanos");
    }

    Ciudadanos.findOne({
        where: {
            id: Ciudadanoid
        }
    })
        .then((result) => {
            const ciudadano = result.dataValues;

            if (!ciudadano) {
                return res.redirect("/ciudadanos");
            }

            res.render("ciudadanos/ciudadanos-save", {
                pageTitle: "Editar ciudadano",
                Ciudadano: ciudadano,
                editMode: edit,
                ciudadanoActive: true,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};


exports.PostUpdateCiudadano = (req, res, next) => {
    const Ciudadanoid = req.body.id;
    const docId = req.body.documentoIdentidad;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const estado = req.body.estado === "activo";
    Ciudadanos.update({
        documentoIdentidad: docId,
        nombre: nombre,
        apellido: apellido,
        email: email,
        estado: estado
    },
        {
            where: {
                id: Ciudadanoid
            }
        })
        .then(ciudadano => {
            res.redirect("/ciudadanos");
        })
        .catch(err => {
            console.log(err);
        })
};

exports.DeleteCiudadano = (req, res, next) => {
    const Ciudadanoid = req.body.id;
    Ciudadanos.destroy({
        where: {
            id: Ciudadanoid
        }
    })
        .then((result) => {
            res.redirect("/ciudadanos");
        })
        .catch((err) => {
            console.log(err);
        });
}