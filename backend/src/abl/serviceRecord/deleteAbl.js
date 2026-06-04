const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const CarDao = require("../../dao/car-dao");
const { validate } = require("../validator");

const schema = {
  type: "object",
  properties: {
    recordId: { type: "string" }
  },
  required: ["recordId"],
  additionalProperties: false
};

function deleteAbl(req, res) {
  const dtoIn = req.query;

  const validation = validate(schema, dtoIn);
  if (!validation.valid) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid",
      errors: validation.errors
    });
  }

  // check if service record exists
  const record = ServiceRecordDao.get(dtoIn.recordId);
  if (!record) {
    return res.status(404).json({
      code: "serviceRecordNotFound",
      message: "service record with given id does not exist"
    });
  }

  // delete the service record
  ServiceRecordDao.delete(dtoIn.recordId);

  // find the latest remaining service record for this car
  const remainingRecords = ServiceRecordDao.listByCarId(record.carId);

  if (remainingRecords.length > 0) {
    // update car mileage to the latest remaining record mileage
    const latestRecord = remainingRecords[0];
    CarDao.updateMileage(record.carId, latestRecord.mileage);
  }

  return res.status(200).json({
    message: "service record deleted successfully"
  });
}

module.exports = deleteAbl;