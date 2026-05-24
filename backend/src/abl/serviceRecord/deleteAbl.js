const ServiceRecordDao = require("../../dao/serviceRecord-dao");
const { validate } = require("../validator");

// AJV schema for serviceRecord/delete input validation
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

  // Delete the service record
  ServiceRecordDao.delete(dtoIn.recordId);

  return res.status(200).json({
    message: "service record deleted successfully"
  });
}

module.exports = deleteAbl;