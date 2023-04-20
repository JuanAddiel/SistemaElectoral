
const Voto = require('../models/votos');

const PuestoElectivo = require('../models/puestoElectivo');

const eleccion = require('../models/elecciones');
const transporter = require("../services/EmailService");
const Usuarios = require('../models/usuarios');



// Modulo a exportar para poder validar de que el usuario no puede estar en esa pagina sin antes estar registrado
exports.isAdmin = (req, res, next) => {
    if (!req.session.user) {
        req.flash("errors", "No estás autorizado para estar en esa página, primero debes iniciar sesión");
        return res.redirect("/login");
    }
    else if (req.session.user.role !== 'administrador') {
        req.flash("errors", "No estás autorizado para estar en la página de administración");
        return res.redirect("/welcome");
    }
    else {
        next();
    }
};

exports.isCitizien = async (req, res, next) => {
    if (!req.session.user) {
        req.flash("errors", "No estás autorizado para estar en esa página, primero debes iniciar sesión");
        return res.redirect("/login");
    }
    else if (req.session.user.role !== 'ciudadano') {
        req.flash("errors", "No estás autorizado para estar en la página de ciudadanos");
        return res.redirect("/candidatos");
    }
    else {
        next();
    }
};



exports.isVoted = async (req, res, next) => {
    const userId = req.session.user.id;
    const eleccionActiva = await eleccion.findOne({ where: { estado: true } });
    const puestosActivos = await PuestoElectivo.findAll({ where: { estado: true } });
    let votos = [];
    if(eleccionActiva){
        
        for (const puesto of puestosActivos) {
            const voto = await Voto.findOne({ where: { usuarioId: userId, puestoElectivoId: puesto.id, eleccioneId: eleccionActiva.id } });
            if (voto) {
                votos.push(voto);
            }
        }
        Usuarios.findOne({ where: { id: userId } })
        .then((result) => {
            const usuario = result.dataValues;

            if (votos.length === puestosActivos.length) {
                req.flash("errors", "Ya has votado");
                res.render("votar/votar", {
                    pageTitle: "Votar",
                    HasVotado: true
                });
                transporter.sendMail({
                    from: "Sistema de Votacion",
                    to: usuario.email,
                    subject: `Felicidades`,
                    html: `<h3> Usted a ejercido su derecho a voto </h3>
                       
                          <p> Ya ejercio derecho a voto, del pais REP.DOM. muchas gracias por haber participado</p>
                       `,
                  });

            } else {
                next();
            }
        })
    }else{
        req.flash("errors", "No hay elecciones activas");
        res.render("votar/votar", {
            pageTitle: "Votar",
            HasEleccion: true
        });
    }
  
  
}
