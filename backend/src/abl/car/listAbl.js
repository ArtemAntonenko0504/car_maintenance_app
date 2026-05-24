const CarDao = require("../../dao/car-dao");

function listAbl(req, res) {
  // Load all cars from storage
  const cars = CarDao.list();

  const dtoOut = {
    itemList: cars
  };

  return res.status(200).json(dtoOut);
}

module.exports = listAbl;