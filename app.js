const path = require('path');
const express = require('express');
const sequelize = require('./context/appContext');
const {engine} = require('express-handlebars');
const errorController = require('./controllers/ErrorController');

//Modulos or Tables
const candidatos = require('./models/candidatos');
const puestoElectivo = require('./models/puestoElectivo');
const partidos = require('./models/partidos');
const elecciones = require('./models/elecciones');
const ciudadanos = require('./models/ciudadanos');
const usuarios = require('./models/usuarios');



const app= express();
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

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", errorController.Get404);


//Relaciones que tienen
candidatos.belongsTo(puestoElectivo,{constraint: true, onDelete:"CASCADE"});
puestoElectivo.hasMany(candidatos);

candidatos.belongsTo(partidos,{constraint: true, onDelete:"CASCADE"});
partidos.hasMany(candidatos);


sequelize.sync(/*{alter:true}*/).then(result=>{
    app.listen(3000);
}).catch(err=>{
    console.log(err);
})
