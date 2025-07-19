const express = require('express');
const cookieParser = require('cookie-parser'); 
const morgan = require('morgan'); // Pour le logging des requêtes
const cors = require('./middleware/cors'); // Assurez-vous que le chemin est correct
const initializeAdmin = require('./initAdmin');
require("dotenv").config();

// Configuration du port
const PORT = process.env.PORT || 5000;

// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); // Utilisation de morgan pour logger les requêtes HTTP

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors); // Utilisation du middleware CORS

// Route de santé pour les health checks
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Alomra opérationnelle' });
});

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Alomra');
});

// Routes pour les utilisateurs (accessible à tous les utilisateurs connectés)
app.use('/profil', require('./routes/Profile_routes'));

// Routes admin (accessible uniquement aux administrateurs)
app.use('/admin', require('./routes/Users_routes'));
app.use('/admin', require('./routes/Reclamation_routes'));
app.use('/admin/notification-emails', require('./routes/NotificationEmail_routes'));

// Routes superviseur
app.use('/superviseur', require('./routes/Reclamation_routes'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Lancer le serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📋 Variables d'environnement:`, {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    NODE_ENV: process.env.NODE_ENV
  });
  
  // Attendre un peu avant d'initialiser l'admin
  setTimeout(async () => {
    try {
      console.log('🔧 Démarrage de l\'initialisation de l\'admin...');
      await initializeAdmin();
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
    }
  }, 5000); // Attendre 5 secondes
});