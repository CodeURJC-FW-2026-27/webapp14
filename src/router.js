import express from 'express';
import { MongoClient } from 'mongodb';
const router = express.Router();
export default router;
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('cinema');
const moviesCollection = db.collection('movies');
router.get('/',  (req, res) => {
  res.render('index');
});