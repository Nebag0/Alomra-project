const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000", // Remplace par l'origine de ton frontend
  credentials: true,
};

module.exports = cors(corsOptions);
