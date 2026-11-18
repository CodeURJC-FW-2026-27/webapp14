export const createBrand = (req) => {
    return {
        name: req.body.bName.trim(),
        country: req.body.bCountry,
        year: req.body.bYear,
        rating: req.body.stars,
        img: `/uploads/logos/${req.file.filename}`,
        segment: req.body.segment,
        description: req.body.bDescription.trim(),
        cars: []
    };
};

export const createModel = (req) => {
    return {
        model: req.body.model,
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
        image: req.file ? req.file.filename : null,
        price: req.body.price,
        originalPrice: req.body.originalPrice,
        discount: req.body.discount
    };
};