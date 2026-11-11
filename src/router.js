import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();
export default router;
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('brands');
const carsCollection = db.collection('cars');

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