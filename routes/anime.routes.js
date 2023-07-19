import { Router } from "express";

import fs from "fs/promises";

import * as path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let pathAnime = path.resolve(__dirname, "../database/anime.json");

//traer todos los personajes INDEX
router.get("/", async (req, res) => {
    try {
        let data = await fs.readFile(pathAnime,"utf-8");
        data = JSON.parse(data);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Error al leer los registros de la DB.",
        });
    }
});

//traer personaje por id READ
router.get("/:id", async (req, res) => {
    try {

        let id = req.params.id
        let data = await fs.readFile(pathAnime,"utf-8");
        data = JSON.parse(data);

        let comicBuscado = data[id];

        if (comicBuscado){
          res.send(comicBuscado);
        } else {
            res.status(404).json({
                code: 404,
                message: `no existe en la base de datos un personaje con el ID: ${id}`,
            });   
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Error al buscar registro en la DB.",
        });
    }
});

//traer personaje por NOMBRE READ
router.get("/nombre/:nombre", async (req, res) => {
    try {

        let nombre = req.params.nombre
        let data = await fs.readFile(pathAnime,"utf-8");
        data = JSON.parse(data);

        let comicBuscado = {};

        let keys = Object.keys(data);
        for (let k of keys) {
            if (data[k].nombre.toLowerCase() === nombre.toLowerCase()){
                comicBuscado = data[k];
                comicBuscado["id"] = k;
                break;
            }
        }

        if (Object.keys(comicBuscado).length > 0){
          res.send(comicBuscado);
        } else {
            res.status(404).json({
                code: 404,
                message: `no existe en la base de datos un personaje con nombre: ${nombre}`,
            });   
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Error al buscar registro en la DB.",
        });
    }
});

//crear nuevo personaje CREATE
router.post("/",  async (req, res) => {
    try {
        let newId = 1
        
        let data = await fs.readFile(pathAnime,"utf-8");
        data = JSON.parse(data);

        let k = Object.getOwnPropertyNames(data)
        if (k.length > 0){
            newId = Number(k[k.length -1]) + 1
        }

        let {nombre, genero, año, autor} = req.body
        if (nombre && genero && año && autor){
            let nuevoPersonaje = { nombre, genero, año, autor};

            data[newId] = nuevoPersonaje;
            await fs.writeFile(pathAnime, JSON.stringify(data,null,2), "utf8");
            
            res.status(201).json({
                code: 201,
                message: `Se ha creado con éxito el personaje con ID: ${newId}`,
                personaje: nuevoPersonaje,
            });

        } else {
            res.status(400).json({
                code: 400,
                message: `Error en datos de entrada`,
            });   
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Error al crear un nuevo personaje",
        });   
    }
});

//actualizar anime UPDATE
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let {nombre, genero, año, autor} = req.body;

        let data = await fs.readFile(pathAnime, "utf-8");
        data = JSON.parse(data);

        let animeBuscado = data[id];

        if (animeBuscado){
            // Asignar valores enviados
            animeBuscado.nombre = nombre || animeBuscado.nombre;
            animeBuscado.genero = genero || animeBuscado.genero;
            animeBuscado.año = año || animeBuscado.año;
            animeBuscado.autor = autor || animeBuscado.autor;
            // ****
            await fs.writeFile(pathAnime, JSON.stringify(data, null, 2), "utf8");

            res.status(201).json({
                code: 201,
                message: `Se ha modificado con éxito el anime con ID: ${id}`,
                anime: animeBuscado,
            });

        } else {
            res.status(404).json({
                code: 404,
                message: `no existe en la base de datos un personaje con el ID: ${id}`,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Error al modificar anime con ID: "+ id,
        });
    }
});

// eliminar DELETE
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let data = await fs.readFile(pathAnime, "utf-8");
        data = JSON.parse(data);

        let animeBuscado = data[id];

        if (animeBuscado){
            delete data[id];
            await fs.writeFile(pathAnime, JSON.stringify(data, null, 2), "utf8");
            res.send({
                code: 200,
                message: "Se ha eliminado con éxito anime con ID: " + id,
                data: animeBuscado,
            });
        } else {
            res.status(404).json({
                code: 404,
                message: `no existe en la base de datos un personaje con el ID: ${id}`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Error al eliminar anime con ID: "+ id,
        });
    }
})



export default router;