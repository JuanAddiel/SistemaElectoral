
const usuario = require('../models/usuarios');
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
  
    usuario.findOne({ where: { email: email} })
      .then((user) => {
        if (!user) {
          req.flash("errors", "email is invalid ");
          return res.redirect("/login");
        }
  
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (result) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((err) => {
                console.log(err);
                res.redirect("/");
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
      res.redirect("/");
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
    const apellido = req.body.apellido;
    const nombreUser = req.body.nombreUser;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
  
    if(password != confirmPassword){
         req.flash(
            "errors",
            "Password and confirm password no equals"
          );
          return res.redirect("/signup");
    }
  
    usuario.findOne({ where: { email: email } })
      .then((user) => {
        if (user) {
          req.flash(
            "errors",
            "email exits already, please pick a different one "
          );
          return res.redirect("/signup");
        }
  
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            usuario.create({nombre: name, apellido:apellido, nombreUser:nombreUser, email: email, password: hashedPassword })
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
  };
  