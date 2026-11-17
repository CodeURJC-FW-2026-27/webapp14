export async function validateModel(
  carsCollection,
  body,
  brandObjectId,
  modelObjectId,
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

  // Check that the license plate has exactly 7 characters
  if (body.plate.length !== 7) {
    return "The license plate must have 7 characters.";
  }

  // Check that the year has exactly 4 digits
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
    _id: brandObjectId,
  });

  if (!brand) {
    return "The brand does not exist.";
  }

  /*
   * Check whether another model in the same brand
   * already uses the same model name.
   */
  const modelExists = (brand.cars || []).some(
    (car) =>
      car.model === body.model &&
      car._id.toString() !== modelObjectId.toString(),
  );

  if (modelExists) {
    return "This model already exists.";
  }

  // Check whether another model uses the same license plate
  const plateExists = (brand.cars || []).some(
    (car) =>
      car.plate === body.plate &&
      car._id.toString() !== modelObjectId.toString(),
  );

  if (plateExists) {
    return "Another model already uses this license plate.";
  }

  // Return null when there are no validation errors
  return null;
}
