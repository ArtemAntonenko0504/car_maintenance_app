const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

// AJV schema for serviceRecord/update input validation
const schema = {
  type: "object",
  properties: {
    recordId: { type: "string" },
    serviceType: { type: "string", maxLength: 150 },
    date: { type: "string", format: "date-time" },
    notes: { type: "string", maxLength: 250 },
    intervalKm: { type: "number" },
    intervalDays: { type: "number" },
    mileage: { type: "number" }
  },
  required: ["recordId"],
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

  // Check if service record exists
  const record = ServiceRecordDao.get(dtoIn.recordId);
  if (!record) {
    return res.status(404).json({
      code: "serviceRecordNotFound",
      message: "service record with given id does not exist"
    });
  }

  // Check if date is not in the future
  if (dtoIn.date) {
    const serviceDate = new Date(dtoIn.date);
    const today = new Date();
    if (serviceDate > today) {
      return res.status(400).json({
        code: "invalidDate",
        message: "date must be current day or a day in the past"
      });
    }
  }

  // Check if mileage is not less than current car mileage
  if (dtoIn.mileage !== undefined) {
    const car = CarDao.get(record.carId);
    if (dtoIn.mileage < car.mileage) {
      return res.status(400).json({
        code: "invalidMileage",
        message: "mileage must not be less than current car mileage"
      });
    }
  }

  // Update the service record
  const dtoOut = ServiceRecordDao.update(dtoIn.recordId, dtoIn);

  return res.status(200).json(dtoOut);
}

module.exports = updateAbl;