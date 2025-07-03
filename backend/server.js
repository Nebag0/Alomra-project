const express = require('express');
const cookieParser = require('cookie-parser'); 
const cors = require('./middleware/cors'); // Assurez-vous que le chemin est correct
require("dotenv").config();


// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cookieParser());


//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors); // Utilisation du middleware CORS

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Alomra');
});
app.use('/admin', require('./routes/Users_routes'));
app.use('/superviseur', require('./routes/Reclamation_routes'));

// Lancer le serveur
app.listen(5000, () => {
  console.log('Serveur démarré sur le port 5000');
});