const mysql = require("mysql2/promise");
require("dotenv").config();

// Configuration pour Kubernetes ou local
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Om@r2003',
  database: process.env.DB_NAME || 'alomra',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

console.log('🔗 Configuration de connexion DB:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
  password: dbConfig.password ? '***' : 'undefined'
});

console.log('📋 Variables d\'environnement:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '***' : 'undefined'
});

const pool = mysql.createPool(dbConfig);

// Test de connexion avec retry
const testConnection = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Tentative de connexion ${i + 1}/${retries}...`);
      const connection = await pool.getConnection();
      console.log('✅ Connexion à MySQL réussie!');
      connection.release();
      return true;
    } catch (err) {
      console.error(`❌ Erreur de connexion à MySQL (tentative ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Nouvelle tentative dans ${delay/1000} secondes...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('💥 Échec de toutes les tentatives de connexion');
        return false;
      }
    }
  }
};

// Tester la connexion au démarrage
testConnection();

module.exports = pool;