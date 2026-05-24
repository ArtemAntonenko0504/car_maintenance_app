const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

// AJV schema for serviceRecord/maintenanceSchedule input validation
const schema = {
  type: "object",
  properties: {
    carId: { type: "string" }
  },
  required: ["carId"],
  additionalProperties: false
};

function maintenanceScheduleAbl(req, res) {
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

  // Filter only records that have an interval defined
  const recordsWithInterval = records.filter(
    (record) => record.interval !== null && record.interval !== undefined
  );

  // Calculate maintenance schedule for each record
  const scheduleList = recordsWithInterval.map((record) => {
    const lastServiceDate = new Date(record.date);

    // Calculate next maintenance date based on interval in days
    const nextMaintenanceDate = new Date(lastServiceDate);
    nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + record.interval);

    // Calculate remaining days until next maintenance
    const today = new Date();
    const remainingDays = Math.ceil(
      (nextMaintenanceDate - today) / (1000 * 60 * 60 * 24)
    );

    // Calculate remaining km until next maintenance
    const remainingKm = record.mileage + record.interval - car.mileage;

    // Mark as urgent if less than 14 days or less than 1000 km remaining
    const isUrgent = remainingDays <= 14 || remainingKm <= 1000;

    return {
      serviceType: record.serviceType,
      lastServiceDate: record.date,
      currentMileage: car.mileage,
      nextMaintenanceDate: nextMaintenanceDate.toISOString(),
      remainingDays: remainingDays,
      remainingKm: remainingKm,
      isUrgent: isUrgent
    };
  });

  // Sort by urgency - most urgent first
  scheduleList.sort((a, b) => a.remainingDays - b.remainingDays);

  const dtoOut = {
    itemList: scheduleList
  };

  return res.status(200).json(dtoOut);
}

module.exports = maintenanceScheduleAbl;