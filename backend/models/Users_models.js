const db = require('../config/connexion_db');

// Récupérer tous les utilisateurs
async function getUsers() {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
}

// Récupérer un utilisateur par ID
async function getUserById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id_user = ?', [id]);
    return rows[0];
}

// Récupérer un utilisateur par email
async function getUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

// Vérifier si un utilisateur existe déjà par email
async function existsUser(email) {
    const [rows] = await db.execute('SELECT id_user FROM users WHERE email = ?', [email]);
    return rows.length > 0;
}

// Créer un utilisateur
async function createUser(data) {
    const [result] = await db.execute(
        `INSERT INTO users (nom, prenom, email, mot_de_passe, role, photo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.nom,
            data.prenom,
            data.email,
            data.mot_de_passe,
            data.role || 'superviseur',
            data.photo || null
        ]
    );
    return result.insertId;
}

// Modifier un utilisateur
async function updateUser(id, data) {
    await db.execute(
        `UPDATE users SET nom=?, prenom=?, email=?, mot_de_passe=?, role=?, photo=? WHERE id_user=?`,
        [
            data.nom,
            data.prenom,
            data.email,
            data.mot_de_passe,
            data.role || 'superviseur',
            data.photo || null,
            id
        ]
    );
}

// Supprimer un utilisateur
async function deleteUser(id) {
    await db.execute('DELETE FROM users WHERE id_user=?', [id]);
}

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    existsUser,
    createUser,
    updateUser,
    deleteUser
};