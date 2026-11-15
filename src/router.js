import express from "express";
import multer from "multer";
import { cargarJson } from "./load_data.js";
import { nameValidator, createBrand } from './creatorBrands.js';
import { db } from "./db.js"; 

const router = express.Router();
export default router;

let brandCars = await cargarJson("cars", "data_brand.json");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/"); // Carpeta donde se guarda el archivo
  },
});
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const carsCollection = db.collection('cars');
  const brandCars = await carsCollection.find().toArray();
  res.render("index", { brandCars });
});

router.get("/createElement", (req, res) => {
  res.render("createElement");
});

let Cars = await cargarJson("detailCars", "data_car.json");

router.get("/detalle", async (req, res) => {
  const Cars = await db.collection("detailCars").find().toArray();
  res.render("detalle", { Cars });
});

router.post("/createElement", upload.single("bImage"), async (req, res) => {
  const carsCollection = db.collection('cars');
  
  const nameNew = req.body.bName.trim();
  const nameExists = await nameValidator(nameNew);
  if (nameExists) {
    return res.render("errorPage", {
      error: "El nombre de la marca ya existe",
    });
  }

  const brand = createBrand(req, res);
  console.log(brand);
  await carsCollection.insertOne(brand);

  res.redirect("/");
});