const express = require('express');
const cookieParser = require('cookie-parser'); 
const morgan = require('morgan'); // Pour le logging des requêtes
const cors = require('./middleware/cors'); // Assurez-vous que le chemin est correct
require("dotenv").config();


// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); // Utilisation de morgan pour logger les requêtes HTTP


//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors); // Utilisation du middleware CORS

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Alomra');
});

// Routes pour les utilisateurs (accessible à tous les utilisateurs connectés)
app.use('/profil', require('./routes/Profile_routes'));

// Routes admin (accessible uniquement aux administrateurs)
app.use('/admin', require('./routes/Users_routes'));

// Routes superviseur
app.use('/superviseur', require('./routes/Reclamation_routes'));

// Lancer le serveur
app.listen(5000, () => {
  console.log('Serveur démarré sur le port 5000');
});