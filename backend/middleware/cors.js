const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3001",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

module.exports = cors(corsOptions);
