const express = require("express");
const router = express.Router();

const createAbl = require("../abl/car/createAbl");
const listAbl = require("../abl/car/listAbl");
const getAbl = require("../abl/car/getAbl");
const updateAbl = require("../abl/car/updateAbl");
const deleteAbl = require("../abl/car/deleteAbl");

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

// POST /car/update - updates a car
router.post("/update", (req, res) => {
  updateAbl(req, res);
});

// DELETE /car/delete - deletes a car
router.delete("/delete", (req, res) => {
  deleteAbl(req, res);
});

module.exports = router;