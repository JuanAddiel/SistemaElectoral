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

    const Ciudadano = new Ciudadanos({
        documentoIdentidad,
        nombre,
        apellido,
        email,
        estado
    });
    Ciudadano.save().then(result => {
        res.redirect("/ciudadanos");
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
};

exports.GetUpdateCiudadano = (req, res, next) => {
    const edit = req.query.edit;
    const documentoIdentidad = req.params.documentoIdentidad; // Obtener el documentoIdentidad de los parámetros de la URL

    if (!edit) {
        return res.redirect("/ciudadanos");
    }

    Ciudadanos.findOne({
            where: {
                documentoIdentidad: documentoIdentidad
            }
        })
        .then((result) => {
            const ciudadano = result.dataValues;

            if (!ciudadano) {
                return res.redirect("/ciudadanos");
            }

            res.render("ciudadanos/ciudadanos-save", {
                pageTitle: "Editar ciudadano",
                Ciudadanos: ciudadano,
                editMode: edit,
                ciudadanoActive: true,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};


exports.PostUpdateCiudadano = (req, res, next) => {
    const documentoIdentidad = req.params.documentoIdentidad;
    Ciudadanos.findOne({
            where: {
                documentoIdentidad: documentoIdentidad
            }
        })
        .then(ciudadano => {
            if (ciudadano) {
                const nuevoDocId = req.body.nuevoDocumentoIdentidad;
                const docId = nuevoDocId ? nuevoDocId : ciudadano.documentoIdentidad;
                const nombre = req.body.nombre;
                const apellido = req.body.apellido;
                const email = req.body.email;
                const estado = req.body.estado === "activo";

                Ciudadanos.update({
                        documentoIdentidad: docId,
                        nombre,
                        apellido,
                        email,
                        estado
                    }, {
                        where: {
                            documentoIdentidad: documentoIdentidad
                        }
                    })
                    .then(() => {
                        res.redirect("/ciudadanos");
                    })
                    .catch(error => {
                        console.log(error);
                        next();
                    });
            } else {
                console.log(`No se encontró un ciudadano con documentoIdentidad ${documentoIdentidad}`);
                next();
            }
        })
        .catch(error => {
            console.log(error);
            next();
        });
};

exports.DeleteCiudadano = (req, res, next) => {
    const documentoIdentidad = req.params.documentoIdentidad;
    Ciudadanos.destroy({
            where: {
                documentoIdentidad: documentoIdentidad
            }
        })
        .then((result) => {
            res.redirect("/ciudadanos");
        })
        .catch((err) => {
            console.log(err);
        });
}