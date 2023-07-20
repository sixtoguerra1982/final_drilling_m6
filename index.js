import express from "express";
const app = express();
const PORT = 3000;
// MODULARIZAR API
import animeRoutes from "./routes/anime.routes.js";
//middlewares
app.use(express.static("./www"));
// Utilizar JSON EN CREATE & UPDATE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//importar rutas para la API /api/v1/anime
app.use("/api/v1/anime", animeRoutes);

// RUTA RAIZ
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// RUTA NO ENCONTRADA
app.get('*', (req, res) => {
    res.status(404).send('Not Found!!!');
});

// LEVANTAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});

export default app;