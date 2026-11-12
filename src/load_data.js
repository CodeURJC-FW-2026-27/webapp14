import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const client = new MongoClient("mongodb://localhost:27017");

export async function cargarJson() {
  await client.connect();
  const db = client.db("brands");
  const carsCollection = db.collection("cars");

  await carsCollection.deleteMany({});

  const filePath = path.resolve("src/data_brand.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const cars = JSON.parse(fileContent);

  if (Array.isArray(cars) && cars.length > 0) {
    await carsCollection.insertMany(cars);
    console.log("¡Datos del JSON cargados exitosamente en MongoDB!");
  }

  await client.close();
}
