import { ObjectId } from "mongodb";
import { db } from "./db.js";

export async function getEditModelData(brandId, modelId) {
  if (!ObjectId.isValid(brandId)) {
    return { redirect: "/" };
  }

  const carsCollection = db.collection("cars");
  const brand = await carsCollection.findOne({ _id: new ObjectId(brandId) });
  if (!brand) {
    return { redirect: "/" };
  }

  const model = (brand.cars || []).find(
    (car) => car._id.toString() === modelId
  );
  if (!model) {
    return { redirect: `/detalle/${brandId}` };
  }

  // Helper para capitalizar (ej: "new" -> "New")
  const cap = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  return {
    brandId: brand._id.toString(),
    modelId: model._id.toString(),
    ...model, // Pasa automáticamente plate, km, year, doors, price, etc.
    model: model.model || model.name,
    
    [`condition${cap(model.condition)}`]: true,
    [`motor${cap(model.motor)}`]: true,
    [`gearbox${cap(model.gearbox)}`]: true,
    hasFinancing: model.financingOptions === "yes"
  };
}