const express = require("express");
const cors = require("cors");

const carController = require("./controllers/carController");
const serviceRecordController = require("./controllers/serviceRecordController");

const app = express();
const PORT = 8000;

// Middleware - functions that process every request
app.use(cors());          // allows requests from frontend
app.use(express.json());  // allows reading JSON from requests

// Connect controllers
app.use("/car", carController);
app.use("/serviceRecord", serviceRecordController);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});