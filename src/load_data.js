import fs from "fs";
import path from "path";
import { db } from "./db.js";

export async function cargarJson(collectionName, Data) {
  // Creamos la colección dinámicamente usando 'db'
  const targetCollection = db.collection(collectionName);

  await targetCollection.deleteMany({});

  let jsonData = "./public/" + Data;
  const filePath = path.resolve(jsonData);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const LoadedData = JSON.parse(fileContent);

  if (Array.isArray(LoadedData) && LoadedData.length > 0) {
    await targetCollection.insertMany(LoadedData);
    console.log(`¡Datos del JSON cargados exitosamente en la colección ${collectionName}!`);
  }

  return LoadedData;
}