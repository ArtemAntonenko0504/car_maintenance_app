const express = require("express");
const router = express.Router();

const createAbl = require("../abl/car/createAbl");
const listAbl = require("../abl/car/listAbl");
const getAbl = require("../abl/car/getAbl");

// POST /car/create - creates a new car
router.post("/create", (req, res) => {
  createAbl(req, res);
});

// GET /car/list - returns a list of all cars
router.get("/list", (req, res) => {
  listAbl(req, res);
});

// GET /car/get - returns a single car by id
router.get("/get", (req, res) => {
  getAbl(req, res);
});

module.exports = router;