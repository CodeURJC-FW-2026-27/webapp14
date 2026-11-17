import express from "express";
import multer from "multer";
import { cargarJson } from "./load_data.js";
import {
  createBrand,
  createModel,
} from "./creatorBrands.js";
import { db } from "./db.js";
import { ObjectId } from "mongodb";
import {
  validateBrand,
  validateNewModel,
  validateEditedModel,
} from "./brandValidator.js";

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

  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const totalCars =
    await carsCollection.countDocuments();

  const totalPages = Math.ceil(
    totalCars / limit,
  );

  const brandCars = await carsCollection
    .find()
    .skip(skip)
    .limit(limit)
    .toArray();

  const uniqueCountries = [
    ...new Set(
      brandCars
        .map((car) => car.country)
        .filter(Boolean),
    ),
  ].sort();

  // Generate the page numbers and mark the active page
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push({
      number: i,
      isCurrent: i === page,
    });
  }

  res.render("index", {
    brandCars,
    pages,
    hasMultiplePages: totalPages > 1,
    uniqueCountries,
  });
});

router.get("/createElement", (req, res) => {
  res.render("createElement");
});
// Detail route: Finds the specific brand and its models
router.get("/detalle/:id", async (req, res) => {
  const carsCollection = db.collection("cars");

  // Check that the brand ID is valid
  if (!ObjectId.isValid(req.params.id)) {
    return res.redirect("/");
  }

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
// Route to create a new brand
router.post(
  "/createElement",
  upload.single("bImage"),
  async (req, res) => {
    const carsCollection = db.collection("cars");

    // Validate the brand information
    const validationError = await validateBrand(
      carsCollection,
      req.body,
    );

    if (validationError) {
      return res.render("errorPage", {
        error: validationError,
      });
    }

    // An image is required when creating a brand
    if (!req.file) {
      return res.render("errorPage", {
        error: "You must add an image",
      });
    }

    const brand = createBrand(req, res);

    const result =
      await carsCollection.insertOne(brand);

    return res.render("success", {
      message: `The brand ${brand.name} has been created successfully`,
      name: brand.name,
      id: result.insertedId.toString(),
    });
  },
);
// Route to create a new model
router.post(
  "/detalle",
  upload.single("image"),
  async (req, res) => {
    const carsCollection = db.collection("cars");
    const brandName = req.query.name;

    // Validate the model information
    const validationError =
      await validateNewModel(
        carsCollection,
        brandName,
        req.body,
      );

    if (validationError) {
      return res.render("errorPage", {
        error: validationError,
      });
    }

    // An image is required when creating a model
    if (!req.file) {
      return res.render("errorPage", {
        error: "You must add an image",
      });
    }

    const model = createModel(req);

    // Add an ObjectId if createModel does not create it
    if (!model._id) {
      model._id = new ObjectId();
    }

    await carsCollection.updateOne(
      {
        name: brandName,
      },
      {
        $push: {
          cars: model,
        },
      },
    );

    const brand = await carsCollection.findOne({
      name: brandName,
    });

    return res.render("success", {
      message: `The model ${model.model} has been added successfully`,
      name: brandName,
      id: brand._id.toString(),
    });
  },
);
// Route to display the model editing form
router.get(
  "/detalle/:brandId/model/:modelId/edit",
  async (req, res) => {
    const carsCollection = db.collection("cars");
    const brandId = req.params.brandId;
    const modelId = req.params.modelId;

    // Check that both IDs are valid
    if (
      !ObjectId.isValid(brandId) ||
      !ObjectId.isValid(modelId)
    ) {
      return res.redirect("/");
    }

    const brand = await carsCollection.findOne({
      _id: new ObjectId(brandId),
    });

    if (!brand) {
      return res.redirect("/");
    }

    // Find the model using its MongoDB ObjectId
    const model = (brand.cars || []).find(
      (car) => car._id.toString() === modelId,
    );

    if (!model) {
      return res.redirect(`/detalle/${brandId}`);
    }

    return res.render("formEditorModel", {
      brandId: brandId,
      modelId: modelId,

      model: model.model,
      plate: model.plate,
      km: model.km,
      year: model.year,
      doors: model.doors,
      horsepower: model.horsepower,
      price: model.price,
      originalPrice: model.originalPrice,
      discount: model.discount,
      image: model.image,

      // Flags for condition
      conditionPoor:
        model.condition === "poor",

      conditionPreowned:
        model.condition === "preowned" ||
        model.condition === "Certified Pre-Owned",

      conditionNew:
        model.condition === "new",

      // Flags for engine type
      motorDiesel:
        model.motor === "diesel",

      motorPetrol:
        model.motor === "petrol",

      motorHybrid:
        model.motor === "hybrid",

      motorElectric:
        model.motor === "electric",

      // Flags for gearbox
      gearboxManual:
        model.gearbox === "manual" ||
        model.gearbox === "Manual",

      gearboxAutomatic:
        model.gearbox === "automatic" ||
        model.gearbox === "Automatic",

      // Flag for financing
      hasFinancing:
        model.financingOptions === "yes" ||
        model.financingOptions === "available",
    });
  },
);
// Route to update an existing model
router.post(
  "/detalle/:brandId/model/:modelId/edit",
  upload.single("image"),
  async (req, res) => {
    const carsCollection = db.collection("cars");
    const brandId = req.params.brandId;
    const modelId = req.params.modelId;

    // Check that both IDs are valid
    if (
      !ObjectId.isValid(brandId) ||
      !ObjectId.isValid(modelId)
    ) {
      return res.redirect("/");
    }

    const brandObjectId = new ObjectId(brandId);
    const modelObjectId = new ObjectId(modelId);

    // Find the brand
    const brand = await carsCollection.findOne({
      _id: brandObjectId,
    });

    if (!brand) {
      return res.redirect("/");
    }

    // Find the current model
    const currentModel = (brand.cars || []).find(
      (car) => car._id.toString() === modelId,
    );

    if (!currentModel) {
      return res.redirect(`/detalle/${brandId}`);
    }

    // Validate the edited model
    const validationError =
      await validateEditedModel(
        carsCollection,
        req.body,
        brandId,
        modelId,
      );

    if (validationError) {
      return res.render("errorPage", {
        error: validationError,
      });
    }

    const updatedModel = {
      _id: modelObjectId,
      brand: brand.name,
      model: req.body.model,
      image: currentModel.image,
      year: req.body.year,
      plate: req.body.plate,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      discount: req.body.discount,
      condition: req.body.condition,
      financingOptions:
        req.body.financingOptions || "no",
      km: req.body.km,
      horsepower: req.body.horsepower,
      motor: req.body.motor,
      gearbox: req.body.gearbox,
      doors: req.body.doors,
    };

    /*
     * Use the new image only when the user
     * selects another image.
     */
    if (req.file) {
      updatedModel.image = req.file.filename;
    }

    // Update the model inside the cars array
    await carsCollection.updateOne(
      {
        _id: brandObjectId,
        "cars._id": modelObjectId,
      },
      {
        $set: {
          "cars.$": updatedModel,
        },
      },
    );

    return res.render("success", {
      message: `The model ${updatedModel.model} has been updated successfully`,
      name: brand.name,
      id: brandId,
    });
  },
);

router.get("/detalle/:id/edit", async (req, res) => {
  const carsCollection = db.collection("cars");

  if (!ObjectId.isValid(req.params.id)) {
    return res.redirect("/");
  }

  const brand = await carsCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!brand) {
    return res.redirect("/");
  }

  res.render("formEditor", {
    id: brand._id.toString(),
    name: brand.name,
    country: brand.country,
    year: brand.year,
    description: brand.description,
    img: brand.img,

    rate1: brand.rating == 1,
    rate2: brand.rating == 2,
    rate3: brand.rating == 3,
    rate4: brand.rating == 4,
    rate5: brand.rating == 5,

    isLowCost: brand.segment === "lowCost",
    isMidRange: brand.segment === "midRange",
    isLuxury: brand.segment === "luxury",
  });
});

router.post(
  "/detalle/:id/edit",
  upload.single("bImage"),
  async (req, res) => {
    const carsCollection = db.collection("cars");

    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.redirect("/");
    }

    const brand = await carsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!brand) {
      return res.redirect("/");
    }

    const validationError = await validateBrand(
      carsCollection,
      req.body,
      id
    );

    if (validationError) {
      return res.render("errorPage", {
        error: validationError,
      });
    }

    const updatedBrand = {
      name: req.body.bName,
      country: req.body.bCountry,
      year: req.body.bYear,
      description: req.body.bDescription,
      rating: req.body.stars,
      segment: req.body.segment,
      img: brand.img,
      cars: brand.cars || [],
    };

    if (req.file) {
      updatedBrand.img = req.file.filename;
    }

    await carsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBrand }
    );

    res.render("success", {
      message: `The brand ${updatedBrand.name} has been updated successfully`,
      name: updatedBrand.name,
      id,
    });
  }
);