const NotificationEmail = require('../models/NotificationEmail_model');
const User = require('../models/Users_models');
const bcrypt = require('bcrypt');

// Récupérer tous les emails à notifier
async function get_notification_emails(req, res) {
    try {
        const emails = await NotificationEmail.getAllNotificationEmails();
        res.status(200).json(emails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Ajouter un email à notifier
async function add_notification_email(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });
    try {
        const id = await NotificationEmail.addNotificationEmail(email);
        res.status(201).json({ id, email });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: "Cet email existe déjà." });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
}

// Supprimer un email à notifier avec vérification du mot de passe admin
async function delete_notification_email(req, res) {
    const { id } = req.params;
    const { adminPassword } = req.body;
    try {
        // Vérifier le mot de passe admin
        const adminUser = await User.getUserById(req.user.id);
        if (!adminUser) {
            return res.status(404).json({ error: "Administrateur non trouvé." });
        }
        const isAdminPasswordValid = await bcrypt.compare(adminPassword, adminUser.mot_de_passe);
        if (!isAdminPasswordValid) {
            return res.status(401).json({ error: "Mot de passe administrateur incorrect." });
        }
        // Supprimer l'email
        await NotificationEmail.deleteNotificationEmail(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    get_notification_emails,
    add_notification_email,
    delete_notification_email
}; 