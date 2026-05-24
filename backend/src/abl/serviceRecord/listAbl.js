const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

// AJV schema for serviceRecord/list input validation
const schema = {
  type: "object",
  properties: {
    carId: { type: "string" }
  },
  required: ["carId"],
  additionalProperties: false
};

function listAbl(req, res) {
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

  // Load all service records for this car
  const records = ServiceRecordDao.listByCarId(dtoIn.carId);

  const dtoOut = {
    itemList: records
  };

  return res.status(200).json(dtoOut);
}

module.exports = listAbl;