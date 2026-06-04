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

  // filter only records that have at least one interval defined
  const recordsWithInterval = records.filter(
    (record) => record.intervalKm || record.intervalDays
  );

  // Calculate maintenance schedule for each record
  const scheduleList = recordsWithInterval.map((record) => {
    const result = {};
    result.serviceType = record.serviceType;
    result.lastServiceDate = record.date;
    result.currentMileage = car.mileage;
    result.intervalKm = record.intervalKm;
    result.intervalDays = record.intervalDays;
    if (record.intervalKm) {
      result.nextMileage = record.mileage + record.intervalKm;
    }

    // calculate by km if intervalKm is set
    if (record.intervalKm) {
      result.nextMileage = record.mileage + record.intervalKm;
      result.remainingKm = result.nextMileage - car.mileage;
    }

    // calculate by days if intervalDays is set
    if (record.intervalDays) {
      const lastServiceDate = new Date(record.date);
      const nextMaintenanceDate = new Date(lastServiceDate);
      nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + record.intervalDays);
      result.nextMaintenanceDate = nextMaintenanceDate.toISOString();
      const today = new Date();
      result.remainingDays = Math.ceil(
        (nextMaintenanceDate - today) / (1000 * 60 * 60 * 24)
      );
    }

    // mark as urgent if less than 14 days or less than 1000 km remaining
    result.isUrgent =
      (result.remainingDays !== undefined && result.remainingDays <= 14) ||
      (result.remainingKm !== undefined && result.remainingKm <= 1000);

    return result;
  });

  // Sort by urgency - most urgent first
  scheduleList.sort((a, b) => a.remainingDays - b.remainingDays);

  const dtoOut = {
    itemList: scheduleList
  };

  return res.status(200).json(dtoOut);
}

module.exports = maintenanceScheduleAbl;