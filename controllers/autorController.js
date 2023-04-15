
const usuario = require('../models/usuarios');
const ciudadano = require('../models/ciudadanos');
const transporter = require("../services/EmailService");
const {Op} = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");


exports.GetLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    loginCSS: true,
    loginActive: true,
  });

};



exports.PostLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let whereClause;
  if (email.includes("@")) {
    whereClause = { email: email };
  } else {
    whereClause = { nombreUser: email };
  }

  usuario.findOne({ where: whereClause })
    .then((user) => {

      if (!user) {
        req.flash("errors", "Invalid email or username");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user; 
            req.session.user.role = user.role;
            return req.session.save((err) => {
              console.log(err);
              (user.role == 'administrador') ? res.redirect("/candidatos") : res.redirect("/votar");
            });
          }
          req.flash("errors", "password is invalid");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          req.flash("errors", "An error has occurred contact the administrator.");
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      req.flash(
        "errors",
        "An error has occurred contact the administrator."
      );
      res.redirect("/login");
    });
};

exports.Logout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/welcome");
  });
};

exports.GetSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    signupActive: true,
  });
};

exports.PostSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const cedula = req.body.cedula;
  const nombreUser = req.body.nombreUser;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password != confirmPassword) {
    req.flash("errors", "Password and confirm password no equals");
    return res.redirect("/signup");
  }

  ciudadano.findOne({ where: { documentoIdentidad: cedula } })
    .then((ciudadano) => {
      if (!ciudadano) {
        req.flash("errors", "No se encontró un ciudadano con el número de cédula proporcionado");
        return res.redirect("/signup");
      }

      usuario.findOne({ where: { email: email } })
        .then((userEmail) => {
          if (userEmail) {
            req.flash(
              "errors",
              "El correo electrónico ya existe, inserte uno diferente"
            );
            return res.redirect("/signup");
          }

          usuario.findOne({ where: { documentoIdentidad: cedula } })
            .then((userCedula) => {
              if (userCedula) {
                req.flash(
                  "errors",
                  "El documento de identificación ya existe, inserte uno diferente"
                );
                return res.redirect("/signup");
              }

              bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                  usuario.create({
                    nombre: name,
                    documentoIdentidad: cedula,
                    nombreUser: nombreUser,
                    email: email,
                    password: hashedPassword,
                    ciudadanoId: ciudadano.id // establece la clave foránea
                  })
                    .then((user) => {
                      res.redirect("/login");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        }).catch((err) => {
          console.log(err);
        })
    });
};



exports.GetReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset",
    loginCSS: true,
    loginActive: true,
  });
};

exports.PostReset = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.falsh("errors", "Contacte al administrador, es un error interno" )
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    usuario.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          req.flash("errors", "No existe una cuenta con este correo");
          return null;
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
        
      })
      .then((result) => {
        let urlRedirect = "/reset";

        if (result) {
          urlRedirect = "/login";

          transporter.sendMail({
            from: "Sistema de Votacion",
            to: email,
            subject: `Recuperacion de Contraseña`,
            html: `<h3> Usted solicito un cambio de contraseña </h3>
               
                  <p> Haga click en este <a href="http://localhost:3000/reset/${token}"> link </a> para colocar una nueva contrasenia </p>
               `,
          });
        }

        res.redirect(urlRedirect);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.GetNewPassword = (req, res, next) => {
  const token = req.params.token;

  usuario.findOne({ where: { resetToken: token, resetTokenExpiration: {[Op.gte]: Date.now()} } })
    .then((user) => {
      if (!user) {
        req.flash("errors", "Token Invalido");
        return res.redirect("/reset");
      }

      res.render("auth/new-password", {
        pageTitle: "Reset",
        loginCSS: true,
        loginActive: true,
        passwordToken: token,
        userId: user.id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.PostNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  if (newPassword != confirmPassword) {
    req.flash("errors", "No coincide las contrasenia");
    return res.redirect("/reset");
  }

  usuario.findOne({
    where: {
      resetToken: passwordToken,
      id: userId,
      resetTokenExpiration: { [Op.gte]: Date.now() },
    },
  })
    .then((user) => {
      //promise

      if (!user) {
        req.flash("errors", "no existe esta cuenta");
        return res.redirect("/reset");
      }

      bcrypt
        .hash(newPassword, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        })
        .catch((err) => {
          console.log(err);
        });

      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
