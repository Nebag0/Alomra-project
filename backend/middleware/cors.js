const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:30100",
  "http://127.0.0.1:30100",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

module.exports = cors(corsOptions);
