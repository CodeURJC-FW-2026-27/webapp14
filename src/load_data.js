import fs from "node:fs/promises";
import { ObjectId } from "mongodb";
import { CarsCollection } from "./db.js";

const DATA_FOLDER = "./views/data";
const UPLOADS_FOLDER = "./public/uploads";
let data_carBrand = "data_brand.json"; // Brands
let data_cardetail = "data_car.json"; // Cars

// Function to safely parse JSON files
async function parseJsonFile(jsonFilePath) {
  let dataString = await fs.readFile(DATA_FOLDER + "/" + jsonFilePath, "utf8");
  return JSON.parse(dataString);
}

export async function cargarJson() {
  // 0. create uploads
  await fs.rm(UPLOADS_FOLDER, { recursive: true, force: true });
  await fs.mkdir(UPLOADS_FOLDER, { recursive: true });
  await fs.cp(DATA_FOLDER + "/logos", UPLOADS_FOLDER + "/logos", { recursive: true });
  await fs.cp(DATA_FOLDER + "/img", UPLOADS_FOLDER + "/img", { recursive: true });

  // 1. Load data from both JSON files
  let brands = await parseJsonFile(data_carBrand);
  let cars = await parseJsonFile(data_cardetail);

  // 2. Clear the collection in the database before reinserting
  await CarsCollection.deleteMany({});

  // 3. Relate each car to its corresponding brand
  for (let brand of brands) {
    brand.cars = [];
    brand._id = new ObjectId(); // Unique ID for the brand

    for (let car of cars) {
      if (brand.name.toLowerCase() === car.brand.toLowerCase()) {
        car._id = new ObjectId();
        brand.cars.push(car);
      }
    }
  }

  // 4. Insert the combined result into MongoDB
  if (Array.isArray(brands) && brands.length > 0) {
    await CarsCollection.insertMany(brands);
    console.log("JSON data successfully loaded into the database!");
  }
}
