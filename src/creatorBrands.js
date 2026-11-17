import { CarsCollection } from './db.js';

// Validates if a brand name already exists
export const nameValidator = async (nameNew) => {
    // Search directly in the database collection for a brand with that name
    const existingBrand = await CarsCollection.findOne({ 
        name: { $regex: new RegExp(`^${nameNew}$`, "i") } 
    });
    return !!existingBrand; // Returns true if it exists, false otherwise
};

export const modelValidator = async (brandName, modelName) => {
    const existingModel = await CarsCollection.findOne({
        name: brandName,
        cars: {
            $elemMatch: {
                name: { $regex: new RegExp(`^${modelName}$`, "i") }
            }
        }
    });
    return !!existingModel; 
};
// Generates the new brand object to be inserted into MongoDB
export const createBrand = (req, res) => {
    let newBrand = {
        name: req.body.bName,
        country: req.body.bCountry,
        year: req.body.bYear,
        rating: req.body.stars,
        // Saves the relative path pointing to your new logos folder
        img: req.file.filename,
        segment: req.body.segment,
        description: req.body.bDescription,
        cars: [] // Initializes an empty array for future cars belonging to this brand
    };
    return newBrand;
}  
export const createModel = (req) => {
   let newModel = {
        name: req.body.model,
        plate: req.body.plate,
        brand: req.body.brand,
        km: req.body.km,
        year: req.body.year,
        doors: req.body.doors,
        condition: req.body.condition,
        motor: req.body.motor,
        gearbox: req.body.gearbox,
        horsepower: req.body.horsepower,
        financingOptions: req.body.financingOptions,
        image: req.file.filename,
        price: req.body.price,
        originalPrice: req.body.originalPrice,
        discount: req.body.discount
    };
    return newModel;
};