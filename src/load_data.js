import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const client = new MongoClient("mongodb://localhost:27017");

export async function cargarJson(collection,Data) {
  await client.connect();
  const db = client.db("brands");
  const carsCollection = db.collection(collection);

  await carsCollection.deleteMany({});

  let jsonData = "./public/"+ Data;
  const filePath = path.resolve(jsonData);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const LoadedData  = JSON.parse(fileContent);

  if (Array.isArray(LoadedData) && LoadedData.length > 0) {
    await carsCollection.insertMany(LoadedData);
    console.log("¡Datos del JSON cargados exitosamente en MongoDB!");
  }

  return LoadedData;

  await client.close();
}
