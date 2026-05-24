const express = require("express");
const router = express.Router();

const createAbl = require("../abl/serviceRecord/createAbl");
const listAbl = require("../abl/serviceRecord/listAbl");
const maintenanceScheduleAbl = require("../abl/serviceRecord/maintenanceScheduleAbl");
const updateAbl = require("../abl/serviceRecord/updateAbl");
const deleteAbl = require("../abl/serviceRecord/deleteAbl");

// POST /serviceRecord/create - creates a new service record
router.post("/create", (req, res) => {
  createAbl(req, res);
});

// GET /serviceRecord/list - returns service history for a car
router.get("/list", (req, res) => {
  listAbl(req, res);
});

// GET /serviceRecord/maintenanceSchedule - returns maintenance schedule for a car
router.get("/maintenanceSchedule", (req, res) => {
  maintenanceScheduleAbl(req, res);
});

// POST /serviceRecord/update - updates a service record
router.post("/update", (req, res) => {
  updateAbl(req, res);
});

// DELETE /serviceRecord/delete - deletes a service record
router.delete("/delete", (req, res) => {
  deleteAbl(req, res);
});

module.exports = router;