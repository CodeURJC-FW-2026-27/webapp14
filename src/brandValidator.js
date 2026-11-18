
import { CarsCollection } from "./db.js";


export const nameValidator = async (nameNew) => {
    const existingBrand = await carsCollection.findOne({ 
        name: { $regex: new RegExp(`^${nameNew}$`, "i") } 
    });
    return existingBrand; 
};

export const validateBrandData = async (body, file) => {
    const { bName, bCountry, bYear, segment, stars, bDescription } = body;

    if (!bName || !bCountry || !bYear || !segment || !stars || !bDescription || !file) {
        return "There are fields left to complete or an image is missing";
    }

    const nameNew = bName.trim();
    const nameExists = await nameValidator(nameNew);
    if (nameExists) {
        return "The brand name already exists";
    }

    const firstLetter = nameNew.charAt(0);
    if (firstLetter !== firstLetter.toUpperCase()) {
        return "The brand name must start with a capital letter.";
    }

    const descriptionLength = bDescription.trim().length; 
    if (descriptionLength < 10 || descriptionLength > 150) {
        return "The description must contain at least 10 characters and fewer than 151.";
    }

    return null;
};