const bcrypt = require('bcrypt');
const db = require('./config/connexion_db');

// Fonction pour attendre que MySQL soit prêt
async function waitForDatabase(maxAttempts = 30) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`🔄 Tentative de connexion à la base de données (${attempt}/${maxAttempts})...`);
            await db.execute('SELECT 1');
            console.log('✅ Connexion à la base de données réussie !');
            return true;
        } catch (error) {
            console.log(`⏳ Attente de MySQL... (${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes
        }
    }
    throw new Error('Impossible de se connecter à la base de données après plusieurs tentatives');
}

async function initializeAdmin() {
    try {
        console.log('🔧 Initialisation de l\'utilisateur admin...');
        
        // Attendre que MySQL soit prêt
        await waitForDatabase();
        
        // Vérifier si l'admin existe déjà
        const [existingUser] = await db.execute(
            'SELECT id_user FROM users WHERE email = ?',
            ['admin@admin.com']
        );
        
        if (existingUser.length === 0) {
            console.log('➕ Création de l\'utilisateur admin...');
            
            // Hasher le mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash('adminadmin', saltRounds);
            
            // Insérer l'utilisateur admin
            await db.execute(
                `INSERT INTO users (nom, prenom, email, mot_de_passe, role, photo)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                ['Admin', 'System', 'admin@admin.com', hashedPassword, 'admin', null]
            );
            
            console.log('✅ Utilisateur admin créé avec succès !');
        } else {
            console.log('✅ Utilisateur admin existe déjà.');
        }
        
        // Vérifier que le hash est correct
        const [userForTest] = await db.execute(
            'SELECT mot_de_passe FROM users WHERE email = ?',
            ['admin@admin.com']
        );
        
        if (userForTest.length > 0) {
            const isValid = await bcrypt.compare('adminadmin', userForTest[0].mot_de_passe);
            if (!isValid) {
                console.log('⚠️ Hash incorrect, mise à jour du mot de passe admin...');
                
                // Mettre à jour le mot de passe
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash('adminadmin', saltRounds);
                
                await db.execute(
                    'UPDATE users SET mot_de_passe = ? WHERE email = ?',
                    [hashedPassword, 'admin@admin.com']
                );
                
                console.log('✅ Mot de passe admin mis à jour !');
            }
        }
        
        console.log('📋 Admin disponible : admin@admin.com / adminadmin');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error.message);
        // Ne pas faire planter le serveur, juste logger l'erreur
    }
}

module.exports = initializeAdmin; 