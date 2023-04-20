//Importamos todos los paquetes que utilizaremos
const path = require('path');
const express = require('express');
const sequelize = require('./context/appContext');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

//Helpers
const compareHelpers = require('./utils/hbs/compare');

//Controladores 
const errorController = require('./controllers/ErrorController');
const welcome = require('./controllers/welcomeController');


//Modulos or Tables
const candidatos = require('./models/candidatos');
const puestoElectivo = require('./models/puestoElectivo');
const partidos = require('./models/partidos');
const elecciones = require('./models/elecciones');
const Ciudadanos = require('./models/ciudadanos');
const Usuarios = require('./models/usuarios');
const candidatoEleccione = require('./models/candidatosElecciones');
const votos = require('./models/votos');



const app = express();
app.engine(
  'hbs',
  engine({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layouts',
    extname: 'hbs',
    helpers: {
      equalValue: compareHelpers.EqualValue,
      and: compareHelpers.and,
      estado: compareHelpers.estatus
    },
  })
)
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, './public')));


//Lo que utilizamos para poder subir imagenes.
app.use("/images", express.static(path.join(__dirname, "images")));


const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

app.use(multer({ storage: imageStorage }).single("Imagen"));


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
  Usuarios.findByPk(req.session.user.id)
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


//Rutas
const autorRoute = require("./routes/autorRoute");
const ciudadanoRoute = require("./routes/ciudadanosRouter");
const puestoElectivosRoute = require("./routes/puestoElectivoRouter");
const candidatoRouter = require('./routes/candidatos');
const partidoRouter = require('./routes/partidos');
const Eleccion = require('./routes/eleccionesRoute');
const VotarRouter = require('./routes/votarRoute');


app.get('/', (req, res) => {
  res.redirect('/welcome');
});
app.use("/welcome",welcome.getWelcome);
app.use(autorRoute);
app.use(candidatoRouter);
app.use(partidoRouter);
app.use(ciudadanoRoute);
app.use(puestoElectivosRoute);
app.use(Eleccion);
app.use(VotarRouter);

app.use(errorController.Get404);


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

Ciudadanos.belongsTo(elecciones, {
  constraint: true,
  onDelete: "CASCADE"
});
elecciones.hasMany(Ciudadanos);

Usuarios.belongsTo(Ciudadanos, {constraint:true, onDelete: "CASCADE"} );

candidatoEleccione.belongsTo(candidatos, { constraint:true, onDelete: "CASCADE"} )
candidatoEleccione.belongsTo(elecciones, { constraint:true, onDelete: "CASCADE"} )
candidatoEleccione.belongsTo(puestoElectivo, { constraint:true, onDelete: "CASCADE"} )
candidatos.hasMany(candidatoEleccione)
elecciones.hasMany(candidatoEleccione)
puestoElectivo.hasMany(candidatoEleccione)

votos.belongsTo(candidatos, { constraint:true, onDelete: "CASCADE"} )
votos.belongsTo(puestoElectivo,{constraint:true, onDelete: "CASCADE"})
votos.belongsTo(Ciudadanos, { constraint:true, onDelete: "CASCADE"} )
votos.belongsTo(elecciones, { constraint:true, onDelete: "CASCADE"} )
votos.belongsTo(Usuarios, { constraint:true, onDelete: "CASCADE"} )

candidatos.hasMany(votos)
Ciudadanos.hasMany(votos)
puestoElectivo.hasMany(votos)
elecciones.hasMany(votos)
Usuarios.hasMany(votos)








sequelize.sync({
  /*alter: true*/
}).then(result => {
  app.listen(3000);
}).catch(err => {
  console.log(err);
})  