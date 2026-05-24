const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const CarDao = require("../../dao/car-dao");

function listAbl(req, res) {
  const dtoIn = req.query;

  // Input validation - carId is required
  if (!dtoIn.carId) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid"
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