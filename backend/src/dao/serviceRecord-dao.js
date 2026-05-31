const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Path to the folder where service record files are stored
const STORAGE_PATH = path.join(__dirname, "storage", "serviceRecordList");

const ServiceRecordDao = {
  // Create a new service record and save it as a separate file
  create(recordData) {
    const record = {
      id: uuidv4(),
      serviceType: recordData.serviceType,
      date: recordData.date,
      notes: recordData.notes,
      intervalKm: recordData.intervalKm,
      intervalDays: recordData.intervalDays,
      mileage: recordData.mileage,
      carId: recordData.carId
    };
    const filePath = path.join(STORAGE_PATH, `${record.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2));
    return record;
  },

  // Return a list of all service records for a specific car
  listByCarId(carId) {
    const files = fs.readdirSync(STORAGE_PATH);
    const records = files.map((file) => {
      const filePath = path.join(STORAGE_PATH, file);
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    });
    // Filter records by carId and sort by date from newest to oldest
    return records
      .filter((record) => record.carId === carId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Return a single service record by its ID
  get(recordId) {
    const filePath = path.join(STORAGE_PATH, `${recordId}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  },

  // Check if a service record with the same date already exists for a car
  getByCarIdAndDate(carId, date) {
    const records = this.listByCarId(carId);
    return records.find((record) => record.date === date) || null;
  },

  // Update service record data
  update(recordId, recordData) {
    const record = this.get(recordId);
    if (!record) return null;
    const updatedRecord = { ...record, ...recordData, id: record.id };
    const filePath = path.join(STORAGE_PATH, `${recordId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(updatedRecord, null, 2));
    return updatedRecord;
  },

  // Delete a service record by its ID
  delete(recordId) {
    const filePath = path.join(STORAGE_PATH, `${recordId}.json`);
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
  }
};

module.exports = ServiceRecordDao;