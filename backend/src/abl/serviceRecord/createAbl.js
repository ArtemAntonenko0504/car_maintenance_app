const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

// AJV schema for serviceRecord/create input validation
const schema = {
  type: "object",
  properties: {
    serviceType: { type: "string", maxLength: 150 },
    date: { type: "string", format: "date-time" },
    notes: { type: "string", maxLength: 250 },
    intervalKm: { type: "number" },
    intervalDays: { type: "number" },
    mileage: { type: "number" },
    carId: { type: "string" }
  },
  required: ["serviceType", "date", "mileage", "carId"],
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

  // Check if date is not in the future
  const serviceDate = new Date(dtoIn.date);
  const today = new Date();
  if (serviceDate > today) {
    return res.status(400).json({
      code: "invalidDate",
      message: "date must be current day or a day in the past"
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

  // Check if mileage is not less than current car mileage
  if (dtoIn.mileage < car.mileage) {
    return res.status(400).json({
      code: "invalidMileage",
      message: "mileage must not be less than current car mileage"
    });
  }

  // Create a new service record
  const dtoOut = ServiceRecordDao.create(dtoIn);

  // Update car mileage if new mileage is greater
  if (dtoIn.mileage > car.mileage) {
    CarDao.updateMileage(dtoIn.carId, dtoIn.mileage);
  }

  return res.status(200).json(dtoOut);
}

module.exports = createAbl;