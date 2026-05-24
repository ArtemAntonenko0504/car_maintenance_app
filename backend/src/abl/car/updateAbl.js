const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

// AJV schema for car/update input validation
const schema = {
  type: "object",
  properties: {
    carId: { type: "string" },
    brand: { type: "string", maxLength: 100 },
    model: { type: "string", maxLength: 100 },
    year: { type: "number" },
    mileage: { type: "number" },
    vin: { type: "string", maxLength: 17 }
  },
  required: ["carId"],
  additionalProperties: false
};

function updateAbl(req, res) {
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

  // Check if car exists
  const car = CarDao.get(dtoIn.carId);
  if (!car) {
    return res.status(404).json({
      code: "carNotFound",
      message: "car with given id does not exist"
    });
  }

  // Check if year is not in the future
  if (dtoIn.year) {
    const currentYear = new Date().getFullYear();
    if (dtoIn.year > currentYear) {
      return res.status(400).json({
        code: "invalidYear",
        message: "year must not be greater than current year"
      });
    }
  }

  // Check if mileage is not negative
  if (dtoIn.mileage !== undefined && dtoIn.mileage < 0) {
    return res.status(400).json({
      code: "invalidMileage",
      message: "mileage must not be negative"
    });
  }

  // Check if new VIN is not already taken by another car
  if (dtoIn.vin) {
    const existingCar = CarDao.getByVin(dtoIn.vin);
    if (existingCar && existingCar.id !== dtoIn.carId) {
      return res.status(400).json({
        code: "vinAlreadyExists",
        message: "car with this VIN already exists"
      });
    }
  }

  // Update the car
  const dtoOut = CarDao.update(dtoIn.carId, dtoIn);

  return res.status(200).json(dtoOut);
}

module.exports = updateAbl;