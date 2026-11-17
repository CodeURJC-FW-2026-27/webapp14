import express from "express";
import multer from "multer";
import { cargarJson } from "./load_data.js";
import { nameValidator, createBrand } from './creatorBrands.js';
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

router.post("/search", async (req, res) => {
  try {
    const carsCollection = db.collection('cars');
    const allCars = await carsCollection.find().toArray();

    const fCountry = req.body["filter-country"];
    const fRating = req.body["filter-rating"];
    const fSegment = req.body["filter-segment"];

    // Usamos el método .filter() de JavaScript
    const filterResult = allCars.filter(car => {
      // Validar país (si se seleccionó y el carro tiene la propiedad)
      const matchCountry = !fCountry || fCountry === "COUNTRY" || 
        (car.country && car.country.toLowerCase() === fCountry.toLowerCase());

      // Validar rating (si se seleccionó y el carro tiene la propiedad)
      const matchRating = !fRating || fRating === "RATING" || 
        (car.rating && String(car.rating) === String(fRating));

      // Validar segmento (si se seleccionó y el carro tiene la propiedad)
      const matchSegment = !fSegment || fSegment === "SEGMENT" || 
        (car.segment && car.segment.toLowerCase() === fSegment.toLowerCase());

      // El elemento pasa el filtro solo si cumple con todos los criterios seleccionados
      return matchCountry && matchRating && matchSegment;
    });

    // Control de mensaje si no hay resultados
    let errorMessage = null;
    if (filterResult.length === 0) {
      errorMessage = "No se encontraron elementos con los requisitos seleccionados.";
    }

    res.render("search", {
      brandCars: filterResult,
      error: errorMessage
    });

  } catch (error) {
    console.error("Error en la búsqueda:", error);
    res.redirect("/");
  }
});

router.post("/input", async (req, res) => {
  try {
    const carsCollection = db.collection('cars');
    const allCars = await carsCollection.find().toArray();

    // Capturamos el valor usando "search" tal como está en tu HTML
    const searchText = req.body.search ? req.body.search.trim().toLowerCase() : "";

    // Filtramos los elementos que coincidan con el nombre
    const filterResult = allCars.filter(car => {
      const result = car.name === searchText;
      return result;
    });

    // Control de mensaje si no hay resultados
    let errorMessage = null;
    if (filterResult.length === 0) {
      errorMessage = "No se encontraron marcas que coincidan con la búsqueda.";
    }

    res.render("input", {
      brandCars: filterResult,
      error: errorMessage
    });

  } catch (error) {
    console.error("Error en la búsqueda por input:", error);
    res.redirect("/");
  }
});