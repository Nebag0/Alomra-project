// Script de test pour vérifier les corrections
const fetch = require('node-fetch');

async function testFixes() {
  console.log('🧪 Test des corrections...\n');

  // Test 1: Vérifier que le serveur répond
  try {
    const response = await fetch('http://localhost:5000/');
    console.log('✅ Serveur accessible:', response.status);
  } catch (error) {
    console.log('❌ Serveur non accessible:', error.message);
    return;
  }

  // Test 2: Test de connexion admin
  try {
    const loginResponse = await fetch('http://localhost:5000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@alomra.com',
        mot_de_passe: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Connexion réussie');
      
      // Test 3: Récupérer un utilisateur pour test de modification
      const usersResponse = await fetch('http://localhost:5000/admin/getUsers', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        if (users.length > 0) {
          const testUser = users[0];
          console.log('✅ Utilisateur trouvé pour test:', testUser.email);
          
          // Test 4: Test de modification (sans mot de passe)
          const updateData = {
            nom: testUser.nom,
            prenom: testUser.prenom,
            email: testUser.email,
            role: testUser.role
          };
          
          const updateResponse = await fetch(`http://localhost:5000/admin/updateUser/${testUser.id_user}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify(updateData)
          });
          
          if (updateResponse.ok) {
            console.log('✅ Modification réussie (sans mot de passe)');
          } else {
            const errorData = await updateResponse.json();
            console.log('❌ Erreur lors de la modification:', errorData.error);
          }
        }
      }
    } else {
      console.log('❌ Échec de la connexion');
    }
  } catch (error) {
    console.log('❌ Erreur lors du test:', error.message);
  }
}

testFixes(); 