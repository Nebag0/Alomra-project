const pool = require('../../config/connexion_db'); 

// Fonction pour récupérer tous les utilisateurs
async function get_user() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}

// Fonction pour récupérer un utilisateur par son ID
async function get_user_by_id(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id_user = ?', [id]);
  return rows[0]; // Retourne le premier utilisateur trouvé
}

// Fonction pour créer un nouvel utilisateur
async function create_user(userData) {
  const [result] = await pool.query('INSERT INTO users SET ?', [userData]);
  return { id: result.insertId, ...userData };
}

module.exports = { get_user, get_user_by_id , create_user };