import { db } from "./db.js"; // Importamos 'db' en lugar de CarsCollection

// Obtener la colección de forma segura
const getCarsCollection = () => db.collection('cars');

// Valida si el nombre ya existe
export const nameValidator = async (nameNew) => {
    const carsCollection = getCarsCollection();
    const existingBrand = await carsCollection.findOne({ 
        name: { $regex: new RegExp(`^${nameNew}$`, "i") } 
    });
    return existingBrand; 
};

export const modelValidator = async (brandName, modelName) => {
    const carsCollection = getCarsCollection();
    const existingModel = await carsCollection.findOne({
        name: brandName,
        cars: {
            $elemMatch: {
                name: { $regex: new RegExp(`^${modelName}$`, "i") }
            }
        }
    });
    return !!existingModel; 
};

// Validaciones completas para la creación de una marca
export const validateBrandData = async (body, file) => {
    const { bName, bCountry, bYear, segment, stars, bDescription } = body;

    // Validar que todos los campos requeridos estén presentes (usando 'stars' como en el formulario)
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

    return null; // Sin errores
};

// Genera el objeto de la nueva marca
export const createBrand = (req) => {
    let newBrand = {
        name: req.body.bName.trim(),
        country: req.body.bCountry,
        year: req.body.bYear,
        rating: req.body.stars, // Asegurado con 'stars'
        img: `/uploads/logos/${req.file.filename}`,
        segment: req.body.segment,
        description: req.body.bDescription.trim(), // Añadido por si acaso lo guardas en la BD
        cars: []
    };
    return newBrand;
};

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

// Validaciones completas para la creación de un modelo
export const validateModelData = async (body, file, brandName) => {
    const {
        model, plate, km, year, doors, condition, motor, 
        gearbox, horsepower, price, originalPrice, discount
    } = body;

    // 1. Validar campos vacíos
    if (
        !model || !plate || !km || !year || !doors || !condition || 
        !motor || !gearbox || !horsepower || !price || !originalPrice || !discount
    ) {
        return "There are fields left to complete";
    }

    // 2. Validar imagen
    if (!file) {
        return "You must add an image";
    }

    // 3. Validar si el modelo ya existe en esa marca
    const existModel = await modelValidator(brandName, model);
    if (existModel) {
        return "This model already exists";
    }

    // 4. Validar matrícula (7 caracteres)
    if (plate.trim().length !== 7) {
        return "The license plate must have 7 digits.";
    }

    // 5. Validar año (4 dígitos)
    if (String(year).trim().length !== 4) {
        return "The year must have 4 digits.";
    }

    // 6. Validar mayúscula inicial en el nombre del modelo
    const firstLetter = model.trim().charAt(0);
    if (firstLetter !== firstLetter.toUpperCase()) {
        return "The model name must start with a capital letter.";
    }

    return null; // Sin errores
};