import express, { raw } from 'express';


import multer from 'multer';
import { MongoClient } from 'mongodb';
import { cargarJson } from './load_data.js';
import  {nameValidator, createBrand} from './creatorBrands.js';
import { carsCollection } from './db.js';
const router = express.Router();
export default router;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guarda el archivo
  },
  });
const upload = multer({ storage: storage });

//await cargarJson();

router.get('/', async (req, res) => {
  let cars = await carsCollection.find().toArray();
  res.render('index', {cars})
});

router.get('/createElement',  (req, res) => {
  res.render('createElement');

});
router.post('/createElement', upload.single('bImage'), async (req, res) => {
    const nameNew = req.body.bName.trim();
    const nameExists = await nameValidator(nameNew);
    if (nameExists) {
      return res.render('errorPage', { error: 'El nombre de la marca ya existe' });
    }

    const brand = createBrand(req, res);
    console.log(brand)
    await carsCollection.insertOne(brand);
  

    res.redirect('/');

});
router.get('/detalle',  (req, res) => {
 
  res.render('detalle', {

    
   
  });
});

