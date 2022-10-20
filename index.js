const express = require('express');
const rootPath = '/api';
const routes = require('./routes');
const app = express();
const cors = require('cors');

// Middleware
// CORS Third-Party Middleware
const whitelist = ['http://localhost'];

let corsOptions = {
    origin : ['http://localhost:4200'],
 }



app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rootPath, routes.points);
app.use(rootPath, routes.login);
app.use(rootPath, routes.scouter);


app.listen('4747', 'localhost', () =>
    console.log(`Servidor escuchando!`),
);