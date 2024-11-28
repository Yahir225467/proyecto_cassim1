// Importar dependencias
const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL
require('dotenv').config(); // Cargar variables de entorno

// Crear una instancia de express
const app = express();

// Configurar middlewares
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(require('cors')()); // Habilitar CORS

// Configurar la conexión a la base de datos usando Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Endpoint para obtener los puntos georeferenciales de escasez de agua
app.get('/padron', async (req, res) => {
  const { page = 1, limit = 100 } = req.query; // Valores predeterminados
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(`
      SELECT *, ST_AsGeoJSON(geom) AS geom
      FROM public.padron
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error.message);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});



//Endpoint para obtener los municipios de Hidalgo
app.get('/municipios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, ST_AsGeoJSON(geom) AS geom
      FROM public.municipios
    `);
    res.json(result.rows); // Enviar los datos en formato JSON
  } catch (error) {
    console.error('Error al consultar la base de datos:', error.message);
    res.status(500).json({
      error: 'Error al consultar la base de datos',
      details: error.message,
    });
  }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});