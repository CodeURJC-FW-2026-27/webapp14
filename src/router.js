import express from "express";
import multer from "multer";
import { cargarJson } from "./load_data.js";
import { nameValidator, createBrand } from './creatorBrands.js';
import { db } from "./db.js"; 

const router = express.Router();
export default router;

// 1. Data loading on startup:
await cargarJson();

// Configured to save brand logos into the specific logos subfolder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/logos/"); 
  },
});

const upload = multer({ storage: storage });

// Home route: Displays all brands (which now contain their nested cars thanks to cargarJson)
router.get("/", async (req, res) => {
  const carsCollection = db.collection('cars');
  const brandCars = await carsCollection.find().toArray();
  res.render("index", { brandCars });
});

router.get("/createElement", (req, res) => {
  res.render("createElement");
});

// Detail route: Finds the specific brand and passes its details and nested cars
router.get("/detalle", async (req, res) => {
  const carsCollection = db.collection('cars');
  const brandName = req.query.name;
  const brand = await carsCollection.findOne({ name: { $regex: new RegExp(`^${brandName}$`, "i") } });

  if (!brand) {
    return res.redirect("/");
  }

  const Cars = brand.cars || [];
  res.render("detalle", {
    name: brand.name,
    img: brand.img,
    country: brand.country,
    year: brand.year,
    rating: brand.rating,
    segment: brand.segment,
    modelsCount: Cars.length,
    Cars
  });
});

// Route to create a new element/brand
router.post("/createElement", upload.single("bImage"), async (req, res) => {
  const carsCollection = db.collection('cars');
  
  const nameNew = req.body.bName.trim();
  const nameExists = await nameValidator(nameNew);
  if (nameExists) {
    return res.render("errorPage", {
      error: "The brand name already exists",
    });
  }
  if(req.body.bName === "" || req.body.bCountry === "" || req.body.bYear === "" || req.body.segment === "" || req.body.starts === "") {
    return res.render("errorPage", {
      error: "There are fields left to complete"
    });
  }
  const firstLetter = nameNew.charAt(0);
  if (firstLetter !== firstLetter.toUpperCase() ) {
     return res.render("errorPage", {
      error: "The brand name must start with a capital letter."
    });
  }

  const descriptionLength = req.body.bDescription.trim().length; 
  if (descriptionLength < 10 || descriptionLength > 150) {
     return res.render("errorPage", {
      error: "The description must contain at least 10 characters and fewer than 151."
    });
  }

  if (!req.file) {
      return res.render("errorPage", {
      error: "You must add an image"
    });
  }
  const brand = createBrand(req, res);
  console.log(brand);
  await carsCollection.insertOne(brand);

  res.render("success", {
    message: `The brand ${brand.name} has been created successfully`,
    name: brand.name
  });
});