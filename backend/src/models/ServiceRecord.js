// ServiceRecord schema example
const serviceRecordSchema = {
  id: "generated unique code",        // unique identifier
  serviceType: "Oil change",          // type of service performed
  date: "2024-10-08T22:50:00.342Z",  // date of service
  notes: "Replaced with 5W-40 oil",  // additional notes
  interval: 15000,                    // recommended maintenance interval (km)
  mileage: 15000,                     // mileage at time of service
  carId: "id of the car"             // reference to Car object
};

module.exports = { serviceRecordSchema };