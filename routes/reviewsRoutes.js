const express = require('express');
const Review = require('../models/reviewModel'); // Importa el modelo de review
const router = express.Router();

// Ruta para crear un nuevo review
router.post('/', async (req, res) => {
    const { name, email, message, rating } = req.body;

    // Validación básica de los campos
    if (!name || !email || !message || rating === undefined) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Validación para asegurarse que la calificación esté entre 1 y 5
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'La calificación debe ser un número entre 1 y 5' });
    }

    try {
        // Crear un nuevo objeto review con los datos proporcionados
        const newReview = new Review({
            name,
            email,
            message,
            rating // Asegúrate de incluir rating aquí
        });

        // Guardar el nuevo review en la base de datos
        await newReview.save();

        // Enviar una respuesta de éxito
        res.status(201).json({
            message: 'Review creado exitosamente',
            review: newReview
        });
    } catch (error) {
        // En caso de error, enviar una respuesta de error
        res.status(500).json({
            message: 'Error al crear el review',
            error: error.message
        });
    }
});

// Ruta para obtener todas las reseñas, ordenadas de mejor a peor
router.get('/', async (req, res) => {
    try {
        // Obtener todas las reviews, ordenadas de mayor a menor por la calificación
        const reviews = await Review.find().sort({ rating: -1 });
        res.status(200).json(reviews); // Enviar las reseñas ordenadas
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las reseñas',
            error: error.message
        });
    }
});


// Ruta para obtener 3 reseñas aleatorias
router.get('/random', async (req, res) => {
    try {
        const reviews = await Review.aggregate([
            { $sample: { size: 3 } } // Seleccionar 3 reseñas aleatorias
        ]);
        res.status(200).json(reviews); // Enviar las 3 reseñas aleatorias
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las reseñas aleatorias',
            error: error.message
        });
    }//   aa
});

// Ruta para obtener las 5 mejores reviews (las más altas)
router.get('/best', async (req, res) => {
    try {
        // Obtener las 5 mejores reviews, ordenadas de mayor a menor por la calificación
        const bestReviews = await Review.find().sort({ rating: -1 }).limit(5); 
        res.json(bestReviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching best reviews', error: error.message });
    }
});


module.exports = router;
