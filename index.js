import express from "express";
const app = express();
const PORT = 3000;
//importar rutas para la API /api/v1/anime
import animeRoutes from "./routes/anime.routes.js";
app.use("/api/v1/anime", animeRoutes);

// RUTA RAIZ
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// RUTA NO ENCONTRADA
app.get('*', (req, res) => {
    res.status(404).send('Not Found!!!');
});

// LEVANTAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
