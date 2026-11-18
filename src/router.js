import express from "express";
import multer from "multer";
import { cargarJson } from "./load_data.js";
import { db } from "./db.js";
import { ObjectId } from "mongodb";
import { filterCars, generatePagination } from "./script.js";
import { validateBrandData } from "./brandValidator.js";
import { validateModelData } from "./modelValidator.js";
import { createBrand, createModel } from "./creatorBrands.js";

const router = express.Router();
export default router;

// 1. Data loading on startup
await cargarJson();

// Configured to save uploaded images
// Configured to save brand and model images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Brand logos
    if (file.fieldname === "bImage") {
      cb(null, "./public/uploads/logos/");
    }

    // Model images
    if (file.fieldname === "image") {
      cb(null, "./public/uploads/img/");
    }
  },

  // Keep the original filename and extension
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// This declaration must appear only once
const upload = multer({ storage: storage });

// Home route: Displays all brands
router.get("/", async (req, res) => {
  const carsCollection = db.collection("cars");

  const brandCars = await carsCollection.find().toArray();
  const uniqueCountries = [
    ...new Set(brandCars.map((car) => car.country).filter(Boolean)),
  ].sort();

  // Load cars in its page
  const { paginatedResults, pages, totalPages, hasMultiplePages } =
    generatePagination(brandCars, req.query.page);

  res.render("index", {
    brandCars: paginatedResults,
    pages,
    totalPages,
    hasMultiplePages,
    uniqueCountries,
  });
});

router.get("/createElement", (req, res) => {
  res.render("createElement");
});

// Detail route
router.get("/detalle/:id", async (req, res) => {
  const carsCollection = db.collection("cars");
  const brand = await carsCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!brand) {
    return res.redirect("/");
  }

  /*
   * Add the brand and model IDs as strings
   * so Mustache can use them in the edit link.
   */
  const Cars = (brand.cars || []).map((car) => ({
    ...car,
    brandId: brand._id.toString(),
    modelId: car._id.toString(),
  }));

  res.render("detalle", {
    id: brand._id.toString(),
    name: brand.name,
    img: brand.img,
    country: brand.country,
    year: brand.year,
    rating: brand.rating,
    description: brand.description,
    segment: brand.segment,
    modelsCount: Cars.length,
    Cars,
  });
});

// Route to create a new element/brand
router.post("/createElement", upload.single("bImage"), async (req, res) => {
  const CarsCollection = db.collection("cars");
  // 1. Ejecutar validaciones de negocio
  const validationError = await validateBrandData(req.body, req.file);
  if (validationError) {
    return res.render("errorPage", { error: validationError });
  }

  // 2. Crear objeto e insertar en base de datos
  const brand = createBrand(req);
  console.log(brand);
  const result = await CarsCollection.insertOne(brand);

  return res.render("success", {
    message: `The brand ${brand.name} has been created successfully`,
    name: brand.name,
    id: result.insertedId.toString(),
  });
});

router.post("/detalle", upload.single("image"), async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandName = req.query.name;

  const brand = await carsCollection.findOne({ name: brandName });

  if (!brand) {
    return res.render("errorPage", {
      error: "The brand does not exist.",
    });
  }

  const validationError = await validateModelData(
    carsCollection,
    req.body,
    brand._id,
  );

  if (validationError) {
    return res.render("errorPage", {
      error: validationError,
    });
  }

  const model = createModel(req);

  await carsCollection.updateOne(
    { _id: brand._id },
    { $push: { cars: model } },
  );

  return res.render("success", {
    message: `The model ${model.name} has been added successfully`,
    name: brandName,
  });
});

router.get("/search", async (req, res) => {
  const carsCollection = db.collection("cars");
  const allCars = await carsCollection.find().toArray();

  // Use imports from script.js
  const results = filterCars(allCars, req.query);

  // Get the params
  const { paginatedResults, pages, hasMultiplePages } = generatePagination(
    results,
    req.query.page,
  );

  // Build string to keep filters active
  const queryParams = new URLSearchParams(req.query);
  queryParams.delete("page");
  const queryString = queryParams.toString()
    ? `&${queryParams.toString()}`
    : "";

  let errorMessage = null;
  if (results.length === 0) {
    errorMessage =
      "No se encontraron elementos con los requisitos seleccionados.";
  }

  res.render("search", {
    cars: paginatedResults,
    pages,
    hasMultiplePages,
    queryString,
    error: errorMessage,
  });
});

router.get("/detalle/:id/edit", async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandId = req.params.id;

  const brand = await carsCollection.findOne({
    _id: new ObjectId(brandId)
  });

  res.render("formEditor", {
    id: brand._id.toString(),
    name: brand.name,
    country: brand.country,
    year: brand.year,
    rating: brand.rating,
    segment: brand.segment,
    description: brand.description,
    img: brand.img
  });
});

router.post("/detalle/:id/edit", upload.single("bImage"), async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandId = req.params.id; 

  console.log(req.body);
  console.log(req.file);

  const updatedBrand = {
    name: req.body.bName,
    country: req.body.bCountry,
    year: req.body.bYear,
    rating: req.body.stars,
    segment: req.body.segment,
    description: req.body.bDescription
  };

  if (req.file) {
    updatedBrand.img = req.file.filename;
  }

  await carsCollection.updateOne(
    { _id: new ObjectId(brandId) },
    { $set: updatedBrand }
  );

  return res.render("success", {
    message: "The brand has been edited",
    name: updatedBrand.name,
    id: brandId
  });
});

router.get("/detalle/:brandId/model/:modelId/edit", (req, res) => {
  res.render("formEditorModel");
});
router.post("/detalle/:id/delete", async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandId = req.params.id;

  const brand = await carsCollection.findOne({
    _id: new ObjectId(brandId),
  });

  const brandName = brand ? brand.name : "Brand";

  await carsCollection.deleteOne({
    _id: new ObjectId(brandId),
  });

  return res.render("success", {
    message: `The brand ${brandName} has been deleted.`,
    deletedOk: true
  });
});
router.post("/detalle/:brandId/model/:modelId/delete", async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandId = req.params.brandId;
  const modelId = req.params.modelId;

  const brand = await carsCollection.findOne({
    _id: new ObjectId(brandId),
  });

  await carsCollection.updateOne(
    { _id: new ObjectId(brandId) },
    { $pull: { cars: { _id: new ObjectId(modelId) } } },
  );

  return res.render("success", {
    message: "The model has been deleted ",
    name: brand.name,
    id: brandId,
  });
});
