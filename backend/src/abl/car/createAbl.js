const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

// AJV schema for car/create input validation
const schema = {
  type: "object",
  properties: {
    brand: { type: "string", maxLength: 100 },
    model: { type: "string", maxLength: 100 },
    year: { type: "number" },
    mileage: { type: "number" },
    vin: { type: "string", maxLength: 17 }
  },
  required: ["brand", "model", "year", "mileage", "vin"],
  additionalProperties: false
};

function createAbl(req, res) {
  const dtoIn = req.body;

  // Validate dtoIn against schema
  const validation = validate(schema, dtoIn);
  if (!validation.valid) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid",
      errors: validation.errors
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