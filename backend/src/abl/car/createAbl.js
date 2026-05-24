const CarDao = require("../../dao/car-dao");

function createAbl(req, res) {
  const dtoIn = req.body;

  // Input validation - check if all required fields are present
  if (!dtoIn.brand || !dtoIn.model || !dtoIn.year || !dtoIn.mileage || !dtoIn.vin) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid"
    });
  }

  // Check if year is not in the future
  const currentYear = new Date().getFullYear();
  if (dtoIn.year > currentYear) {
    return res.status(400).json({
      code: "invalidYear",
      message: "year must not be greater than current year"
    });
  }

  // Check if mileage is not negative
  if (dtoIn.mileage < 0) {
    return res.status(400).json({
      code: "invalidMileage",
      message: "mileage must not be negative"
    });
  }

  // Check if car with the same VIN already exists
  const existingCar = CarDao.getByVin(dtoIn.vin);
  if (existingCar) {
    return res.status(400).json({
      code: "vinAlreadyExists",
      message: "car with this VIN already exists"
    });
  }

  // Create a new car object
  const dtoOut = CarDao.create(dtoIn);

  return res.status(200).json(dtoOut);
}

module.exports = createAbl;