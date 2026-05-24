const CarDao = require("../../dao/car-dao");

function getAbl(req, res) {
  const dtoIn = req.query;

  // Input validation - carId is required
  if (!dtoIn.carId) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid"
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