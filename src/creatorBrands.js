import { carsCollection } from './db.js';

export const nameValidator = async (nameNew) => {
    const existName = await carsCollection.findOne({ name: nameNew }); 
    return !!existName;
};
export const createBrand = (req, res) => {
    let newBrand = {
    name: req.body.bName ,
    country:req.body.bCountry,
    year: req.body.bYear,
    rating: req.body.stars,
    image: req.file.filename,
    segment: req.body.segment
    }
    return newBrand;
}