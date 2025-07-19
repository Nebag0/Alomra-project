const db = require('../config/connexion_db');

// Récupérer tous les emails à notifier
async function getAllNotificationEmails() {
    const [rows] = await db.execute('SELECT * FROM notification_emails ORDER BY id');
    return rows;
}

// Ajouter un email à notifier
async function addNotificationEmail(email) {
    const [result] = await db.execute('INSERT INTO notification_emails (email) VALUES (?)', [email]);
    return result.insertId;
}

// Supprimer un email à notifier
async function deleteNotificationEmail(id) {
    await db.execute('DELETE FROM notification_emails WHERE id = ?', [id]);
}

module.exports = {
    getAllNotificationEmails,
    addNotificationEmail,
    deleteNotificationEmail
}; 