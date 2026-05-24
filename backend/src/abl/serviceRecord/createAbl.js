const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const CarDao = require("../../dao/car-dao");

function createAbl(req, res) {
  const dtoIn = req.body;

  // Input validation - check if all required fields are present
  if (!dtoIn.serviceType || !dtoIn.date || !dtoIn.mileage || !dtoIn.carId) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid"
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

  // Check if service record with the same date already exists for this car
  const existingRecord = ServiceRecordDao.getByCarIdAndDate(dtoIn.carId, dtoIn.date);
  if (existingRecord) {
    return res.status(400).json({
      code: "serviceRecordAlreadyExists",
      message: "service record with this date already exists for this car"
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