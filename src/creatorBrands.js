import { carsCollection } from './db.js';

export const nameValidator = async (nameNew) => {
    const cars = await carsCollection.find().toArray();
    const existName = cars.find(car => car.name.toLowerCase() === nameNew.toLowerCase());
    return !!existName; 
};
export const createBrand = (req, res) => {
    let newBrand = {
    name: req.body.bName ,
    country:req.body.bCountry,
    year: req.body.bYear,
    rating: req.body.stars,
    image: req.file.filename,
    segment: req.body.segment,
    models: []
    }
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