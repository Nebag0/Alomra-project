// Script de test pour vérifier l'API
const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Test de l\'API Alomra...\n');

  // Test 1: Vérifier que le serveur répond
  try {
    const response = await fetch('http://localhost:5000/');
    console.log('✅ Serveur accessible:', response.status);
  } catch (error) {
    console.log('❌ Serveur non accessible:', error.message);
    return;
  }

  // Test 2: Test de connexion (vous devrez ajuster les credentials)
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
      console.log('✅ Connexion réussie, token obtenu');
      
      // Test 3: Récupérer les utilisateurs
      const usersResponse = await fetch('http://localhost:5000/admin/getUsers', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        console.log('✅ Récupération des utilisateurs réussie:', users.length, 'utilisateurs trouvés');
      } else {
        console.log('❌ Erreur lors de la récupération des utilisateurs');
      }
    } else {
      console.log('❌ Échec de la connexion');
    }
  } catch (error) {
    console.log('❌ Erreur lors du test:', error.message);
  }
}

testAPI(); 