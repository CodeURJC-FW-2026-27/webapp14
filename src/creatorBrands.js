import { CarsCollection } from './db.js';

// Validates if a brand name already exists
export const nameValidator = async (nameNew) => {
    // Search directly in the database collection for a brand with that name
    const existingBrand = await CarsCollection.findOne({ 
        name: { $regex: new RegExp(`^${nameNew}$`, "i") } 
    });
    return !!existingBrand; // Returns true if it exists, false otherwise
};

// Generates the new brand object to be inserted into MongoDB
export const createBrand = (req, res) => {
    let newBrand = {
        name: req.body.bName,
        country: req.body.bCountry,
        year: req.body.bYear,
        rating: req.body.stars,
        // Saves the relative path pointing to your new logos folder
        img: `/uploads/logos/${req.file.filename}`,
        segment: req.body.segment,
        description: req.body.bDescription,
        cars: [] // Initializes an empty array for future cars belonging to this brand
    };
    return newBrand;
}  
export const createModel = (req) => {
   let newModel = {
        model: req.body.mName,
        plate: req.body.mPlate,
        brand: req.body.mBrand,
        km: Number(req.body.mKm),
        year: Number(req.body.mYear),
        doors: Number(req.body.mDoors),
        condition: req.body.mCondition,
        motor: req.body.mMotor,
        gearbox: req.body.mGearbox,
        horsepower: Number(req.body.mHorsepower),
        financingOptions: req.body.mFinancing ? 'Yes' : 'No',
        image: req.file ? req.file.filename : '',
        price: Number(req.body.mPrice)
    };
    return newModel;
};