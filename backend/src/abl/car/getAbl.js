const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

// AJV schema for car/get input validation
const schema = {
  type: "object",
  properties: {
    carId: { type: "string" }
  },
  required: ["carId"],
  additionalProperties: false
};

function getAbl(req, res) {
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

  // Load car by id
  const car = CarDao.get(dtoIn.carId);

  // Check if car exists
  if (!car) {
    return res.status(404).json({
      code: "carNotFound",
      message: "car with given id does not exist"
    });
  }

  return res.status(200).json(car);
}

module.exports = getAbl;