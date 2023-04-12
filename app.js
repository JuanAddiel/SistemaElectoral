const path = require('path');
const express = require('express');
const sequelize = require('./context/appContext');
const {
    engine
} = require('express-handlebars');
const errorController = require('./controllers/ErrorController');
const session = require('express-session');
const flash = require('connect-flash');
//Modulos or Tables
const candidatos = require('./models/candidatos');
const puestoElectivo = require('./models/puestoElectivo');
const partidos = require('./models/partidos');
const elecciones = require('./models/elecciones');
const ciudadanos = require('./models/ciudadanos');
const usuarios = require('./models/usuarios');

const ciudadano = require("./routes/ciudadanosRouter");
const puestoElectivos = require("./routes/puestoElectivoRouter");


const app = express();
app.engine(
    'hbs',
    engine({
        layoutsDir: 'views/layouts/',
        defaultLayout: 'main-layouts',
        extname: 'hbs'
    })
)
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(ciudadano);
app.use(puestoElectivos);
app.use(
    session({ secret: "anything", resave: true, saveUninitialized: false })
  );
  
  app.use(flash());
  
  app.use((req, res, next) => {
    if (!req.session) {
      return next();
    }
    if (!req.session.user) {
      return next();
    }
    usuarios.findByPk(req.session.user.id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  app.use((req, res, next) => {
    const errors = req.flash("errors");  
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.errorMessages = errors;
    res.locals.hasErrorMessages = errors.length > 0;
    next();
  });

  
const autorRoute = require("./routes/autorRoute");

const candidatoRouter = require('./routes/candidatos');
const partidoRouter = require('./routes/partidos');

app.use(autorRoute);
app.use(candidatoRouter);
app.use(partidoRouter);

app.use("/", errorController.Get404);


//Relaciones que tienen
candidatos.belongsTo(puestoElectivo, {
    constraint: true,
    onDelete: "CASCADE"
});
puestoElectivo.hasMany(candidatos);

candidatos.belongsTo(partidos, {
    constraint: true,
    onDelete: "CASCADE"
});
partidos.hasMany(candidatos);


sequelize.sync({
    /*alter: true*/
}).then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})