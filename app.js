require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('node:path');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    throw new Error('Falta configurar MONGODB_URI en el archivo .env.');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/scripts.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts.js'));
});

app.use('/', taskRoutes);

app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Página no encontrada',
        message: 'La página que buscas no existe.'
    });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', {
        title: 'Error del servidor',
        message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.'
    });
});

mongoose.connect(mongoUri)
    .then(() => {
        app.listen(port, () => {
            console.log(`Aplicación disponible en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('No fue posible conectar con MongoDB:', error.message);
        process.exitCode = 1;
    });
