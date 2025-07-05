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
    const updateData = {
        nom: data.nom || null,
        prenom: data.prenom || null,
        email: data.email || null,
        role: data.role || 'superviseur',
        photo: data.photo || null
    };
    
    await db.execute(
        `UPDATE users SET nom=?, prenom=?, email=?, role=?, photo=? WHERE id_user=?`,
        [
            updateData.nom,
            updateData.prenom,
            updateData.email,
            updateData.role,
            updateData.photo,
            id
        ]
    );
}

// Supprimer un utilisateur
async function deleteUser(id) {
    await db.execute('DELETE FROM users WHERE id_user=?', [id]);
}

// Supprimer un utilisateur et ses réclamations
async function deleteUserWithReclamations(id) {
    // Commencer une transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
        // 1. Supprimer d'abord les entrées dans reclamation_motif pour les réclamations de cet utilisateur
        await connection.execute(
            'DELETE rm FROM reclamation_motif rm INNER JOIN reclamations r ON rm.reclamation_id = r.id WHERE r.created_by = ?', 
            [id]
        );
        
        // 2. Supprimer les réclamations associées
        await connection.execute('DELETE FROM reclamations WHERE created_by = ?', [id]);
        
        // 3. Puis supprimer l'utilisateur
        await connection.execute('DELETE FROM users WHERE id_user = ?', [id]);
        
        // Valider la transaction
        await connection.commit();
    } catch (error) {
        // En cas d'erreur, annuler la transaction
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Récupérer un utilisateur par ID (méthode supplémentaire)
async function get_user_by_id_db(id) {
  const [rows] = await db.query("SELECT id_user, nom, prenom, email, role FROM users WHERE id_user = ?", [id]);
  return rows[0];
}

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    existsUser,
    createUser,
    updateUser,
    deleteUser,
    deleteUserWithReclamations,
    get_user_by_id_db
};