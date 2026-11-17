import { ObjectId } from "mongodb";

// Validate the information used to create or edit a brand
export async function validateBrand(
  carsCollection,
  body,
  excludedId = null,
) {
  // Check that all required fields are completed
  if (
    !body.bName ||
    !body.bCountry ||
    !body.bYear ||
    !body.segment ||
    !body.stars ||
    !body.bDescription
  ) {
    return "There are fields left to complete";
  }

  // Create the filter used to check duplicated brand names
  const filter = {
    name: body.bName,
  };

  // Exclude the current brand when editing
  if (excludedId) {
    filter._id = {
      $ne: new ObjectId(excludedId),
    };
  }

  const nameExists = await carsCollection.findOne(filter);

  if (nameExists) {
    return "The brand name already exists";
  }

  // Check that the brand name starts with a capital letter
  const firstLetter = body.bName.charAt(0);

  if (firstLetter !== firstLetter.toUpperCase()) {
    return "The brand name must start with a capital letter.";
  }

  // Check the description length
  if (
    body.bDescription.length < 10 ||
    body.bDescription.length > 150
  ) {
    return "The description must contain at least 10 characters and fewer than 151.";
  }

  // Check that the rating is valid
  if (!["1", "2", "3", "4", "5"].includes(body.stars)) {
    return "The rating must be between 1 and 5.";
  }

  // Check that the segment is valid
  if (
    !["lowCost", "midRange", "luxury"].includes(body.segment)
  ) {
    return "The selected segment is not valid.";
  }

  return null;
}

// Validate the information used to create a model
export async function validateNewModel(
  carsCollection,
  brandName,
  body,
) {
  // Check that all required fields are completed
  if (
    !body.model ||
    !body.plate ||
    !body.km ||
    !body.year ||
    !body.doors ||
    !body.condition ||
    !body.motor ||
    !body.gearbox ||
    !body.horsepower ||
    !body.price ||
    !body.originalPrice ||
    !body.discount
  ) {
    return "There are fields left to complete";
  }

  // Find the brand
  const brand = await carsCollection.findOne({
    name: brandName,
  });

  if (!brand) {
    return "The brand does not exist.";
  }

  // Check whether the model already exists
  const modelExists = (brand.cars || []).some(
    (car) => car.model === body.model,
  );

  if (modelExists) {
    return "This model already exists";
  }

  // Check whether another model uses the same plate
  const plateExists = (brand.cars || []).some(
    (car) => car.plate === body.plate,
  );

  if (plateExists) {
    return "Another model already uses this license plate.";
  }

  // Check the license plate length
  if (body.plate.length !== 7) {
    return "The license plate must have 7 characters.";
  }

  // Check the year length
  if (body.year.length !== 4) {
    return "The year must have 4 digits.";
  }

  // Check that the model name starts with a capital letter
  const firstLetter = body.model.charAt(0);

  if (firstLetter !== firstLetter.toUpperCase()) {
    return "The model name must start with a capital letter.";
  }

  return null;
}

// Validate the information used to edit a model
export async function validateEditedModel(
  carsCollection,
  body,
  brandId,
  modelId,
) {
  // Check that all required fields are completed
  if (
    !body.model ||
    !body.plate ||
    !body.km ||
    !body.year ||
    !body.doors ||
    !body.condition ||
    !body.motor ||
    !body.gearbox ||
    !body.horsepower ||
    !body.price ||
    !body.originalPrice ||
    !body.discount
  ) {
    return "There are fields left to complete";
  }

  // Check the license plate length
  if (body.plate.length !== 7) {
    return "The license plate must have 7 characters.";
  }

  // Check the year length
  if (body.year.length !== 4) {
    return "The year must have 4 digits.";
  }

  // Check that the model name starts with a capital letter
  const firstLetter = body.model.charAt(0);

  if (firstLetter !== firstLetter.toUpperCase()) {
    return "The model name must start with a capital letter.";
  }

  // Find the brand that contains the model
  const brand = await carsCollection.findOne({
    _id: new ObjectId(brandId),
  });

  if (!brand) {
    return "The brand does not exist.";
  }

  // Check whether another model has the same name
  const modelExists = (brand.cars || []).some(
    (car) =>
      car.model === body.model &&
      car._id.toString() !== modelId,
  );

  if (modelExists) {
    return "This model already exists";
  }

  // Check whether another model has the same plate
  const plateExists = (brand.cars || []).some(
    (car) =>
      car.plate === body.plate &&
      car._id.toString() !== modelId,
  );

  if (plateExists) {
    return "Another model already uses this license plate.";
  }

  return null;
}