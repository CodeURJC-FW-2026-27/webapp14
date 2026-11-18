import express from "express";
import multer from "multer";
import { cargarJson } from "./load_data.js";
import { db } from "./db.js";
import { ObjectId } from "mongodb";
import * as fPag from "./filtersAndPagination.js";
import { validateBrandData } from "./brandValidator.js";
import { validateModelData } from "./modelValidator.js";
import * as creator from "./creatorBrands.js";
import * as setters from "./update.js";
import { getEditModelData } from "./edit.js";


const router = express.Router();
export default router;

// Data loading on setup
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
    fPag.generatePagination(brandCars, req.query.page);

  res.render("index", {
    brandCars: paginatedResults,
    pages,
    totalPages,
    hasMultiplePages,
    uniqueCountries,
  });
});

router.get("/createElement", (req, res) => {
  res.render("createElement", {
    pageTitle: "Creator of brands",
    mainTitle: "BRAND CREATOR",
    subtitle: "Create any brand.",
    formTitle: "Create your brand here",
    formAction: "/createElement",
    cancelUrl: "/",
    submitText: "CREATE",
    isEdit: false,
    noSegment: true
  });
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
  const brand = creator.createBrand(req);
  console.log(brand);
  const result = await CarsCollection.insertOne(brand);

  return res.render("success", {
    message: `The brand ${brand.name} has been created successfully`,
    name: brand.name,
    id: result.insertedId.toString(),
  });
});

router.post("/detalle", upload.single("image"), async (req, res) => {
  const carsCollection = db.collection('cars');
  const brandName = req.query.name;

  const brand = await carsCollection.findOne({ name: brandName });

  if (!brand) {
    return res.render("errorPage", {
      error: "The brand does not exist."
    });
  }
  const validationError = await validateModelData(carsCollection, req.body, brand._id, null, req.file);
  if (validationError) {
    return res.render("errorPage", {
      error: validationError
    });
  }

  const model = creator.createModel(req);

  await carsCollection.updateOne(
    { _id: brand._id },
    { $push: { cars: model } }
  );

  return res.render("success", {
    message: `The model ${model.name} has been added successfully`,
    name: brandName,
    id: brand._id.toString()
  });
});

router.get("/search", async (req, res) => {
  const carsCollection = db.collection("cars");
  const allCars = await carsCollection.find().toArray();

  // Use imports from script.js
  const results = fPag.filterCars(allCars, req.query);

  // Get the params
  const { paginatedResults, pages, hasMultiplePages } = fPag.generatePagination(
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

  if (!ObjectId.isValid(req.params.id)) {
    return res.redirect("/");
  }

  const brand = await carsCollection.findOne({
    _id: new ObjectId(req.params.id)
  });

  if (!brand) {
    return res.status(404).render("errorPage", {
      error: "Brand not found"
    });
  }

  res.render("createElement", {
    pageTitle: "Brand Editor",
    mainTitle: "BRAND EDITOR",
    subtitle: "Edit your brand.",
    formTitle: "Edit your brand here",

    formAction: `/detalle/${brand._id.toString()}/edit`,
    cancelUrl: `/detalle/${brand._id.toString()}`,
    submitText: "EDIT",

    isEdit: true,

    name: brand.name,
    year: brand.year.split("-").reverse().join("-"),
    country: brand.country,
    description: brand.description,
    img: brand.img,

    [`rate${brand.rating}`]: true,

    isLowCost: brand.segment === "lowCost",
    isMidRange: brand.segment === "midRange",
    isLuxury: brand.segment === "luxury"
  });
});


// Update brand
router.post("/detalle/:id/edit", upload.single("bImage"), async (req, res) => {
  
  const result = await setters.setBrandUpdate(req.params.id, req.body, req.file);
  if (result.redirect) return res.redirect(result.redirect);
  if (result.error) return res.render("errorPage", {error: result.error});

  return res.render("success", {
    message: result.message,
    name: result.name,
    id: result.id
  });
});


//Edit model page

router.get("/detalle/:brandId/model/:modelId/edit", async (req, res) => {
  const result = await getEditModelData(
    req.params.brandId,
    req.params.modelId
  );

  if (result.redirect) {
    return res.redirect(result.redirect);
  }

  res.render("formEditorModel", result);
});
//Update model
router.post("/detalle/:brandId/model/:modelId/edit", upload.single("image"), async (req, res) => {
  const result = 
  await setters.setModelUpdate(req.params.brandId, req.params.modelId, req.body, req.file);

  if (result.redirect) return res.redirect(result.redirect);
  if (result.error) return res.render("errorPage", { error: result.error });

  return res.render("success", {
    message: result.message,
    name: result.name,
    id: result.id
  });
});

router.post("/detalle/:id/delete", async (req, res) => {
  const result = await setters.setBrandDelete(req.params.id);

  return res.render("success", {
    message: result.message,
    deletedOk: result.deletedOk
  });
});

// Delete model
router.post("/detalle/:brandId/model/:modelId/delete", async (req, res) => {
  const result = await setters.modelDelete(req.params.brandId, req.params.modelId);

  if (result.redirect) {
    return res.redirect(result.redirect);
  }

  return res.render("success", {
    message: result.message,
    name: result.name,
    id: result.id,
  });
});
