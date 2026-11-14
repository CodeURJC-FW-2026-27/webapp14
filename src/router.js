import express from 'express';


import multer from 'multer';
import { MongoClient } from 'mongodb';
import { cargarJson } from './load_data.js';

const router = express.Router();
export default router;
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('brands');
const carsCollection = db.collection('cars');

let brandCars = await cargarJson("cars","data_brand.json");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploads/'); // Carpeta donde se guarda el archivo
  },
  });
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  res.render('index', {brandCars})
});

router.get('/createElement',  (req, res) => {
  res.render('createElement');
});

let Cars = await cargarJson("detailCars","data_car.json");

router.get('/detalle',  (req, res) => {
  res.render('detalle', {Cars});
});

