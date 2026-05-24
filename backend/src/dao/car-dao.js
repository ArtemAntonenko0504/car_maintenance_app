const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Path to the folder where car files are stored
const STORAGE_PATH = path.join(__dirname, "storage", "carList");

const CarDao = {
  // Create a new car and save it as a separate file
  create(carData) {
    const car = {
      id: uuidv4(),
      brand: carData.brand,
      model: carData.model,
      year: carData.year,
      mileage: carData.mileage,
      vin: carData.vin
    };
    const filePath = path.join(STORAGE_PATH, `${car.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(car, null, 2));
    return car;
  },

  // Return a list of all cars
  list() {
    const files = fs.readdirSync(STORAGE_PATH);
    return files.map((file) => {
      const filePath = path.join(STORAGE_PATH, file);
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    });
  },

  // Return a single car by its ID
  get(carId) {
    const filePath = path.join(STORAGE_PATH, `${carId}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  },

  // Find a car by VIN code
  getByVin(vin) {
    const cars = this.list();
    return cars.find((car) => car.vin === vin) || null;
  },

  // Update mileage of a car
  updateMileage(carId, newMileage) {
    const car = this.get(carId);
    if (!car) return null;
    car.mileage = newMileage;
    const filePath = path.join(STORAGE_PATH, `${carId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(car, null, 2));
    return car;
  },

  // Update car data
  update(carId, carData) {
    const car = this.get(carId);
    if (!car) return null;
    const updatedCar = { ...car, ...carData, id: car.id };
    const filePath = path.join(STORAGE_PATH, `${carId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(updatedCar, null, 2));
    return updatedCar;
  },

  // Delete a car by its ID
  delete(carId) {
    const filePath = path.join(STORAGE_PATH, `${carId}.json`);
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
  }
};

module.exports = CarDao;