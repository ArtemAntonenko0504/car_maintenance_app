const Ajv = require("ajv");
const addFormats = require("ajv-formats");

// Create AJV instance
const ajv = new Ajv();
addFormats(ajv);

// Validate dtoIn against schema
function validate(schema, dtoIn) {
  const validateFn = ajv.compile(schema);
  const valid = validateFn(dtoIn);

  if (!valid) {
    return {
      valid: false,
      errors: validateFn.errors
    };
  }

  return { valid: true };
}

module.exports = { validate };