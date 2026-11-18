import { CarsCollection } from "./db.js";
import { ObjectId } from "mongodb";

export const nameValidator = async (nameNew, excludeId = null) => {
    const query = { name: { $regex: new RegExp(`^${nameNew}$`, "i") } };
    
    // Si se pasa un excludeId (en edición), ignoramos la propia marca para que no de conflicto consigo misma
    if (excludeId) {
        query._id = { $ne: new ObjectId(excludeId) };
    }
    
    return await CarsCollection.findOne(query);
};

export const validateBrandData = async (body, file, currentBrand = null) => {
    const { bName, bCountry, bYear, segment, stars, bDescription } = body;

    // Si es edición, la imagen es válida si se sube una nueva O si ya existe una previa en la base de datos
    const hasImage = file || (currentBrand && currentBrand.img);

    if (!bName || !bCountry || !bYear || !segment || !stars || !bDescription || !hasImage) {
        return "There are fields left to complete or an image is missing";
    }

    const nameNew = bName.trim();
    const excludeId = currentBrand ? currentBrand._id : null;
    
    const nameExists = await nameValidator(nameNew, excludeId);
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