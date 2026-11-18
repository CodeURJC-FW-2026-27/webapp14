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
  
  // 1. Validar que el ID sea válido para MongoDB por seguridad
  if (!ObjectId.isValid(req.params.id)) {
    return res.redirect("/");
  }

  const brand = await carsCollection.findOne({ _id: new ObjectId(req.params.id) });

  // 2. Comprobar si la marca existe antes de usarla
  if (!brand) {
    return res.status(404).render("errorPage", { error: "Brand not found" });
  }

  res.render("formEditor", {
    id: brand._id.toString(), // <-- Aquí es donde fallaba si brand era null
    name: brand.name,
    year: brand.year,
    country: brand.country,
    description: brand.description,
    img: brand.img,
    [`rate${brand.rating}`]: true,
    isLowCost: brand.segment === "lowCost",
    isMidRange: brand.segment === "midRange",
    isLuxury: brand.segment === "luxury"
  });
});

router.post("/detalle/:id/edit", upload.single("bImage"), async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandId = req.params.id; 

  // 1. Obtener la marca actual de la base de datos
  const currentBrand = await carsCollection.findOne({ _id: new ObjectId(brandId) });
  if (!currentBrand) {
    return res.redirect("/");
  }

  // 2. Ejecutar validaciones reutilizables pasando la marca actual
  const validationError = await validateBrandData(req.body, req.file, currentBrand);
  if (validationError) {
    return res.render("errorPage", { error: validationError });
  }

  // 3. Preparar los datos actualizados
  const updatedBrand = {
    name: req.body.bName.trim(),
    country: req.body.bCountry.trim(),
    year: req.body.bYear.trim(),
    rating: req.body.stars,
    segment: req.body.segment,
    description: req.body.bDescription.trim(),
    img: req.file ? req.file.filename : currentBrand.img
  };

  // 4. Actualizar en la base de datos
  await carsCollection.updateOne(
    { _id: new ObjectId(brandId) },
    { $set: updatedBrand }
  );

  // 5. Renderizar vista de éxito
  return res.render("success", {
    message: "The brand has been edited",
    name: updatedBrand.name,
    id: brandId
  });
});

router.get("/detalle/:brandId/model/:modelId/edit", async (req, res) => {
  const carsCollection = db.collection("cars");

  if (!ObjectId.isValid(req.params.brandId)) {
    return res.redirect("/");
  }

  const brand = await carsCollection.findOne({
    _id: new ObjectId(req.params.brandId)
  });

  if (!brand) {
    return res.redirect("/");
  }

  const model = (brand.cars || []).find(
    car => car._id.toString() === req.params.modelId
  );

  if (!model) {
    return res.redirect(`/detalle/${req.params.brandId}`);
  }

  res.render("formEditorModel", {
    brandId: brand._id.toString(),
    modelId: model._id.toString(),
    model: model.model || model.name,
    plate: model.plate,
    km: model.km,
    year: model.year,
    doors: model.doors,
    condition: model.condition,
    motor: model.motor,
    gearbox: model.gearbox,
    horsepower: model.horsepower,
    financingOptions: model.financingOptions,
    price: model.price,
    originalPrice: model.originalPrice,
    discount: model.discount,
    image: model.image,
  });
});

router.post(
  "/detalle/:brandId/model/:modelId/edit",
  upload.single("image"),
  async (req, res) => {
    const carsCollection = db.collection("cars");
    const brandId = req.params.brandId;
    const modelId = req.params.modelId;

    const brandObjectId = new ObjectId(brandId);
    const modelObjectId = new ObjectId(modelId);

    // 1. Buscar la marca y el modelo actual
    const brand = await carsCollection.findOne({ _id: brandObjectId });
    if (!brand) {
      return res.redirect("/");
    }

    const currentModel = (brand.cars || []).find(
      (car) => car._id.toString() === modelId
    );

    // 2. Ejecutar las validaciones centralizadas pasando carsCollection
    const validationError = await validateModelData(
      carsCollection,
      req.body,
      brandObjectId,
      modelObjectId,
      req.file,
      currentModel
    );

    if (validationError) {
      return res.render("errorPage", { error: validationError });
    }

    // 3. Preparar los datos actualizados
    const updatedModel = {
      "cars.$.model": req.body.model.trim(),
      "cars.$.plate": req.body.plate.trim(),
      "cars.$.km": req.body.km,
      "cars.$.year": req.body.year,
      "cars.$.doors": req.body.doors,
      "cars.$.condition": req.body.condition,
      "cars.$.motor": req.body.motor,
      "cars.$.gearbox": req.body.gearbox,
      "cars.$.horsepower": req.body.horsepower,
      "cars.$.financingOptions": req.body.financingOptions || "no",
      "cars.$.price": req.body.price,
      "cars.$.originalPrice": req.body.originalPrice,
      "cars.$.discount": req.body.discount,
      "cars.$.image": req.file ? req.file.filename : (currentModel ? currentModel.image : "")
    };

    // 4. Actualizar en la base de datos
    await carsCollection.updateOne(
      {
        _id: brandObjectId,
        "cars._id": modelObjectId
      },
      {
        $set: updatedModel
      }
    );

    // 5. Renderizar vista de éxito
    return res.render("success", {
      message: "The model has been edited",
      name: brand.name,
      id: brandId
    });
  }
);

router.post("/detalle/:id/delete", async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandId = req.params.id;

  const brand = await carsCollection.findOne({
    _id: new ObjectId(brandId),
  });

  if (!brand) {
    return res.redirect("/");
  }

  const brandName = brand.name;

  await carsCollection.deleteOne({
    _id: new ObjectId(brandId),
  });

  return res.render("delete", {
    message: `The brand ${brandName} has been deleted.`,
  });
});

router.post("/detalle/:brandId/model/:modelId/delete", async (req, res) => {
  const carsCollection = db.collection("cars");
  const brandId = req.params.brandId;
  const modelId = req.params.modelId;

  const brand = await carsCollection.findOne({
    _id: new ObjectId(brandId),
  });

  if (!brand) {
    return res.redirect("/");
  }

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
