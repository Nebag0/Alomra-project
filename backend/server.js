const express = require('express');
const cookieParser = require('cookie-parser'); 
const path = require('path');
const cors = require("cors");
require("dotenv").config();


// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cookieParser());


//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Alomra');
});
app.use('/admin', require('./routes/admin/Users_routes'));
app.use('/superviseur', require('./routes/superviseur/Reclamation_routes'));

// Lancer le serveur
app.listen(5000, () => {
  console.log('Serveur démarré sur le port 5000');
});