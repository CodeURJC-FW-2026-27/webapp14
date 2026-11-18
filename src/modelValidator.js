export const validateModelData = async (carsCollection, body, brandObjectId, modelObjectId = null, file = null, currentModel = null) => {
    const {
        model, plate, km, year, doors, condition, motor, 
        gearbox, horsepower, price, originalPrice, discount
    } = body;

    const hasImage = file || (currentModel && currentModel.image);

    if (
        !model || !plate || !km || !year || !doors || !condition || 
        !motor || !gearbox || !horsepower || !price || !originalPrice || !discount || !hasImage
    ) {
        return "There are fields left to complete or an image is missing";
    }

    if (plate.trim().length !== 7) {
        return "The license plate must have 7 characters.";
    }

    if (String(year).trim().length !== 4) {
        return "The year must have 4 digits.";
    }

    const firstLetter = model.trim().charAt(0);
    if (firstLetter !== firstLetter.toUpperCase()) {
        return "The model name must start with a capital letter.";
    }

    const brand = await carsCollection.findOne({ _id: brandObjectId });
    if (!brand) {
        return "The brand does not exist.";
    }

    const modelExists = (brand.cars || []).some(
        (car) =>
            car.model.toLowerCase() === model.toLowerCase() &&
            (!modelObjectId || car._id.toString() !== modelObjectId.toString())
    );

    if (modelExists) {
        return "This model already exists.";
    }

    const plateExists = (brand.cars || []).some(
        (car) =>
            car.plate.toLowerCase() === plate.toLowerCase() &&
            (!modelObjectId || car._id.toString() !== modelObjectId.toString())
    );

    if (plateExists) {
        return "Another model already uses this license plate.";
    }

    return null;
};