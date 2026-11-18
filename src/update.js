import { db } from "./db.js";
import { ObjectId } from "mongodb";
import { validateBrandData } from "./brandValidator.js";
import { validateModelData } from "./modelValidator.js";



export async function setBrandUpdate(brandId, body, file) {
  const carsCollection = db.collection("cars");

  if (!ObjectId.isValid(brandId)) return { redirect: "/" };

  const currentBrand = await carsCollection.findOne({ _id: new ObjectId(brandId) });
  if (!currentBrand) return { redirect: "/" };

  const validationError = await validateBrandData(body, file, currentBrand);
  if (validationError) return { error: validationError };

  const updatedBrand = {
    name: body.bName.trim(),
    country: body.bCountry.trim(),
    year: body.bYear.trim(),
    rating: body.stars,
    segment: body.segment,
    description: body.bDescription.trim(),
    img: file ? file.filename : currentBrand.img
  };

  await carsCollection.updateOne(
    { _id: new ObjectId(brandId) },
    { $set: updatedBrand }
  );

  return {
    message: "The brand has been edited",
    name: updatedBrand.name,
    id: brandId
  };
}

// Función de actualización renombrada a setUpdate para el modelo (o marca)
export async function setModelUpdate(brandId, modelId, body, file) {
  const carsCollection = db.collection("cars");

  const brandObjectId = new ObjectId(brandId);
  const modelObjectId = new ObjectId(modelId);

  // 1. Buscar la marca y el modelo actual
  const brand = await carsCollection.findOne({ _id: brandObjectId });
  if (!brand) {
    return { redirect: "/" };
  }

  const currentModel = (brand.cars || []).find(
    (car) => car._id.toString() === modelId
  );

  // 2. Ejecutar las validaciones centralizadas
  const validationError = await validateModelData(
    carsCollection,
    body,
    brandObjectId,
    modelObjectId,
    file,
    currentModel
  );

  if (validationError) {
    return { error: validationError };
  }

  // 3. Preparar los datos actualizados
  const updatedModel = {
    "cars.$.model": body.model.trim(),
    "cars.$.plate": body.plate.trim(),
    "cars.$.km": body.km,
    "cars.$.year": body.year,
    "cars.$.doors": body.doors,
    "cars.$.condition": body.condition,
    "cars.$.motor": body.motor,
    "cars.$.gearbox": body.gearbox,
    "cars.$.horsepower": body.horsepower,
    "cars.$.financingOptions": body.financingOptions || "no",
    "cars.$.price": body.price,
    "cars.$.originalPrice": body.originalPrice,
    "cars.$.discount": body.discount,
    "cars.$.image": file ? file.filename : (currentModel ? currentModel.image : "")
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

  // 5. Retornar los datos para el render de éxito
  return {
    message: "The model has been edited",
    name: brand.name,
    id: brandId
  };
}

export async function setBrandDelete(brandId) {
  const carsCollection = db.collection("cars");
  const brand = await carsCollection.findOne({ _id: new ObjectId(brandId) });
  const brandName = brand ? brand.name : "Brand";

  await carsCollection.deleteOne({ _id: new ObjectId(brandId) });

  return {
    message: `The brand ${brandName} has been deleted.`,
    deletedOk: true
  };
}

export async function modelDelete(brandId, modelId) {
  const carsCollection = db.collection("cars");

  const brand = await carsCollection.findOne({
    _id: new ObjectId(brandId),
  });

  if (!brand) {
    return { redirect: "/" };
  }

  await carsCollection.updateOne(
    { _id: new ObjectId(brandId) },
    { $pull: { cars: { _id: new ObjectId(modelId) } } },
  );

  return {
    message: "The model has been deleted",
    name: brand.name,
    id: brandId,
  };
}