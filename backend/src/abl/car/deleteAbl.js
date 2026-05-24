const CarDao = require("../../dao/car-dao");
const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const { validate } = require("../validator");

// AJV schema for car/delete input validation
const schema = {
  type: "object",
  properties: {
    carId: { type: "string" }
  },
  required: ["carId"],
  additionalProperties: false
};

function deleteAbl(req, res) {
  const dtoIn = req.query;

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

  // Delete all service records for this car first
  const records = ServiceRecordDao.listByCarId(dtoIn.carId);
  records.forEach((record) => {
    ServiceRecordDao.delete(record.id);
  });

  // Delete the car
  CarDao.delete(dtoIn.carId);

  return res.status(200).json({
    message: "car deleted successfully"
  });
}

module.exports = deleteAbl;