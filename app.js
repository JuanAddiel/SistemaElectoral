const path = require('path');
const express = require('express');
const {engine} = require('express-handlebars');
const errorController = require('./controllers/ErrorController');
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
app.listen(3000);