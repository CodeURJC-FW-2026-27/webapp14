import express from "express";
import multer from "multer";
import { cargarJson } from "./load_data.js";
import { nameValidator, createBrand, createModel, modelValidator } from './creatorBrands.js';
import { db } from "./db.js";
import { ObjectId } from "mongodb";

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
  console.log(brandCars);
  res.render("index", { brandCars });
});

router.get("/createElement", (req, res) => {
  res.render("createElement");
});

// Detail route: Finds the specific brand and passes its details and nested cars
router.get("/detalle/:id", async (req, res) => {
  const carsCollection = db.collection('cars');

  // Búsqueda directa convirtiendo el parámetro a ObjectId
  const brand = await carsCollection.findOne({ _id: new ObjectId(req.params.id) });

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
    description: brand.description,
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
    res.render("errorPage", {
      error: "The brand name already exists",
    });
  } else
    if (req.body.bName === "" || req.body.bCountry === "" || req.body.bYear === "" || req.body.segment === "" || req.body.stars === "") {
      res.render("errorPage", {
        error: "There are fields left to complete"
      });
    } else {
      const firstLetter = nameNew.charAt(0);
      if (firstLetter !== firstLetter.toUpperCase()) {
        res.render("errorPage", {
          error: "The brand name must start with a capital letter."
        });
      } else {
        const descriptionLength = req.body.bDescription.trim().length;
        if (descriptionLength < 10 || descriptionLength > 150) {
          res.render("errorPage", {
            error: "The description must contain at least 10 characters and fewer than 151."
          });
        } else {
          if (!req.file) {
            res.render("errorPage", {
              error: "You must add an image"
            });
          } else {
            const brand = createBrand(req, res);
            console.log(brand);
            await carsCollection.insertOne(brand);

            res.render("success", {
              message: `The brand ${brand.name} has been created successfully`,
              name: brand.name
            });
          }


        }


      }
    }
});
router.post("/detalle", upload.single("image"), async (req, res) => {
  const carsCollection = db.collection('cars');
  const brandName = req.query.name;


  const existModel = await modelValidator(brandName, req.body.model);

  if (
    req.body.model === "" ||
    req.body.plate === "" ||
    req.body.km === "" ||
    req.body.year === "" ||
    req.body.doors === "" ||
    req.body.condition === "" ||
    req.body.motor === "" ||
    req.body.gearbox === "" ||
    req.body.horsepower === "" ||
    req.body.price === "" ||
    req.body.originalPrice === "" ||
    req.body.discount === ""
  ) {
    return res.render("errorPage", {
      error: "There are fields left to complete"
    });
  }

  if (!req.file) {
    return res.render("errorPage", {
      error: "You must add an image"
    });
  }

  if (existModel) {
    return res.render("errorPage", {
      error: "This model already exists"
    });
  }

  if (req.body.plate.trim().length !== 7 ) {
    return res.render("errorPage", {
      error: "The license plate must have 7 digits."
    });
  }
  if (req.body.year.length !== 4) {
      return res.render("errorPage", {
      error: "The year must have 4 digits."
    });
  }
  const firstLetter = req.body.model.charAt(0);
  if (firstLetter !== firstLetter.toUpperCase()) {
    return res.render("errorPage", {
      error: "The model name must start with a capital letter."
    });
  }
  const model = createModel(req);

  await carsCollection.updateOne(
    { name: brandName },
    { $push: { cars: model } }
  );
  res.render("success", {
    message: `The model ${model.name} has been added successfully`,
    name: brandName
  });
});

router.post("/search", async (req, res) => {
  const carsCollection = db.collection('cars');
  const allCars = await carsCollection.find().toArray();

  const searchText = req.body.search ? req.body.search.trim().toLowerCase() : "";
  const fCountry = req.body["filter-country"];
  const fRating = req.body["filter-rating"];
  const fSegment = req.body["filter-segment"];

  let results = [];

  // Si se envió el formulario de la barra de búsqueda (texto)
  if (req.body.search !== undefined && searchText !== "") {
    results = allCars.filter(car => car.name && car.name.toLowerCase().includes(searchText));
  } else {
    // Si se envió el formulario con los selectores (filtros)
    results = allCars.filter(car => {
      const matchCountry = !fCountry || fCountry === "COUNTRY" ||
        (car.country && car.country.toLowerCase() === fCountry.toLowerCase());

      const matchRating = !fRating || fRating === "RATING" ||
        (car.rating && String(car.rating) === String(fRating));

      const matchSegment = !fSegment || fSegment === "SEGMENT" ||
        (car.segment && car.segment.toLowerCase() === fSegment.toLowerCase());

      return matchCountry && matchRating && matchSegment;
    });
  }

  let errorMessage = null;
  if (results.length === 0) {
    errorMessage = "No se encontraron elementos con los requisitos seleccionados.";
  }

  res.render("search", {
    cars: results,
    error: errorMessage
  });
});