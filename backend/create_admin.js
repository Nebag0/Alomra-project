const bcrypt = require('bcrypt');
const db = require('./config/connexion_db');

async function createAdminUser() {
    try {
        console.log('🔧 Création de l\'utilisateur admin...');
        
        // Données de l'admin
        const adminData = {
            nom: 'Admin',
            prenom: 'System',
            email: 'admin@admin.com',
            mot_de_passe: 'adminadmin',
            role: 'admin',
            photo: null
        };
        
        // Vérifier si l'admin existe déjà
        const [existingUser] = await db.execute(
            'SELECT id_user FROM users WHERE email = ?',
            [adminData.email]
        );
        
        if (existingUser.length > 0) {
            console.log('⚠️ L\'utilisateur admin existe déjà. Mise à jour du mot de passe...');
            
            // Hasher le mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(adminData.mot_de_passe, saltRounds);
            
            // Mettre à jour le mot de passe
            await db.execute(
                'UPDATE users SET mot_de_passe = ? WHERE email = ?',
                [hashedPassword, adminData.email]
            );
            
            console.log('✅ Mot de passe admin mis à jour !');
        } else {
            console.log('➕ Création d\'un nouvel utilisateur admin...');
            
            // Hasher le mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(adminData.mot_de_passe, saltRounds);
            
            // Insérer l'utilisateur admin
            const [result] = await db.execute(
                `INSERT INTO users (nom, prenom, email, mot_de_passe, role, photo)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    adminData.nom,
                    adminData.prenom,
                    adminData.email,
                    hashedPassword,
                    adminData.role,
                    adminData.photo
                ]
            );
            
            console.log('✅ Utilisateur admin créé avec succès !');
        }
        
        // Vérifier que tout fonctionne
        const [user] = await db.execute(
            'SELECT id_user, email, role FROM users WHERE email = ?',
            [adminData.email]
        );
        
        if (user.length > 0) {
            console.log('👤 Utilisateur admin trouvé :');
            console.log(`   ID: ${user[0].id_user}`);
            console.log(`   Email: ${user[0].email}`);
            console.log(`   Role: ${user[0].role}`);
        }
        
        // Test de connexion avec bcrypt
        const [userForTest] = await db.execute(
            'SELECT mot_de_passe FROM users WHERE email = ?',
            [adminData.email]
        );
        
        if (userForTest.length > 0) {
            const isValid = await bcrypt.compare(adminData.mot_de_passe, userForTest[0].mot_de_passe);
            console.log(`🔐 Test de connexion bcrypt: ${isValid ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
        }
        
        console.log('\n📋 Informations de connexion :');
        console.log('   Email: admin@admin.com');
        console.log('   Mot de passe: adminadmin');
        console.log('   URL: http://localhost:3000/login');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        process.exit(0);
    }
}

createAdminUser(); 