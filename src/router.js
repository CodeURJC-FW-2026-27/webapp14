import express from 'express';


import multer from 'multer';
import { MongoClient } from 'mongodb';
import { cargarJson } from './load_data.js';

const router = express.Router();
export default router;
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('brands');
const carsCollection = db.collection('cars');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploads/'); // Carpeta donde se guarda el archivo
  },
  });
const upload = multer({ storage: storage });

await cargarJson();

router.get('/', async (req, res) => {
  let cars = await carsCollection.find().toArray();
  res.render('index', {cars})
});

router.get('/createElement',  (req, res) => {
  res.render('createElement');
});
router.get('/detalle',  (req, res) => {
  res.render('detalle', {
    name: req.query.name
  });
});

