require('dotenv').config(); // Cargar las variables de entorno desde .env
const express = require('express');
const connectDB = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/reviews', require('./routes/reviewsRoutes'));

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
