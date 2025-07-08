const User = require('../models/Users_models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET || 'votre_secret_jwt'; // Mets une vraie valeur secrète en prod

// Récupérer tous les utilisateurs
async function get_users(req, res) {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const { users, total } = await User.getUsersWithSearchAndPagination({ search, limit, offset });
    res.status(200).json({ users, total, page, limit });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
}

// Récupérer un utilisateur par ID
async function get_user_by_id(req, res) {
  try {
    const user = await User.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
  }
}

// Créer un utilisateur
async function create_user(req, res) {
  const { nom = '', prenom = '', email = '', mot_de_passe = '', role = 'superviseur', photo = null, telephone = '', adresse = null } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe || !telephone) {
    return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
  }

  try {
    const exists = await User.existsUser(email);
    if (exists) {
      return res.status(409).json({ error: "Un compte avec cet email existe déjà." });
    }

    if (mot_de_passe.length < 6) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    // Hasher le mot de passe avec bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

    const userId = await User.createUser({ nom, prenom, email, mot_de_passe: hashedPassword, role, photo, telephone, adresse });
    res.status(201).json({ message: "Utilisateur créé avec succès.", userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Modifier un utilisateur
async function update_user(req, res) {
  const { nom = '', prenom = '', email = '', role = 'superviseur', photo = null, telephone = '', adresse = null } = req.body;
  const { id } = req.params;

  if (!nom || !prenom || !email || !telephone) {
    return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
  }

  try {
    const updateData = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      role: role || 'superviseur',
      photo: photo || null,
      telephone: telephone,
      adresse: adresse || null
    };
    
    await User.updateUser(id, updateData);
    res.status(200).json({ message: "Utilisateur modifié avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Changer le mot de passe de l'utilisateur connecté
async function change_password(req, res) {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id || req.user.id_user;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Ancien et nouveau mot de passe requis." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères." });
  }

  try {
    // Récupérer l'utilisateur actuel
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Vérifier l'ancien mot de passe avec bcrypt
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.mot_de_passe);
    if (!isOldPasswordValid) {
      return res.status(401).json({ error: "Ancien mot de passe incorrect." });
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const isNewPasswordSame = await bcrypt.compare(newPassword, user.mot_de_passe);
    if (isNewPasswordSame) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit être différent de l'ancien." });
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    await User.updateUser(userId, { mot_de_passe: hashedNewPassword });
    res.status(200).json({ message: "Mot de passe changé avec succès." });
  } catch (err) {
    console.error('Erreur lors du changement de mot de passe:', err);
    res.status(500).json({ error: "Erreur lors du changement de mot de passe." });
  }
}

// Supprimer un utilisateur avec vérification de sécurité
async function delete_user_secure(req, res) {
  const { id } = req.params;
  const { adminPassword } = req.body;
  
  try {
    // Vérifier que l'utilisateur à supprimer existe
    const userToDelete = await User.getUserById(id);
    if (!userToDelete) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Vérifier que l'admin ne peut supprimer que des superviseurs
    if (userToDelete.role === 'admin') {
      return res.status(403).json({ error: "Vous ne pouvez pas supprimer un compte administrateur." });
    }

    // Vérifier le mot de passe de l'admin avec bcrypt
    const adminUser = await User.getUserById(req.user.id);
    if (!adminUser) {
      return res.status(404).json({ error: "Administrateur non trouvé." });
    }

    const isAdminPasswordValid = await bcrypt.compare(adminPassword, adminUser.mot_de_passe);
    if (!isAdminPasswordValid) {
      return res.status(401).json({ error: "Mot de passe administrateur incorrect." });
    }

    // Supprimer l'utilisateur et ses réclamations
    await User.deleteUserWithReclamations(id);
    res.status(200).json({ message: "Utilisateur et ses réclamations supprimés avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Supprimer un utilisateur (ancienne version)
async function delete_user(req, res) {
  const { id } = req.params;
  try {
    await User.deleteUser(id);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Connexion d'un utilisateur
async function login(req, res) {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  try {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }
    
    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe invalide." });
    }
    
    // Générer le token
    const token = jwt.sign(
      { id: user.id_user, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Récupérer le profil de l'utilisateur connecté
async function get_my_profile(req, res) {
  try {
    // Compatibilité avec différents formats de payload JWT
    const id = req.user.id || req.user.id_user || req.user.ID || req.user.ID_USER;
    if (!id) {
      return res.status(400).json({ error: "Impossible de déterminer l'ID utilisateur depuis le token." });
    }
    const user = await User.get_user_by_id_db(id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error('Erreur get_my_profile:', err);
    res.status(500).json({ error: err.message });
  }
}

// Vérifier le mot de passe administrateur
async function verify_admin_password(req, res) {
  const { adminPassword } = req.body;
  
  if (!adminPassword) {
    return res.status(400).json({ error: "Mot de passe administrateur requis." });
  }

  try {
    const adminUser = await User.getUserById(req.user.id);
    if (!adminUser) {
      return res.status(404).json({ error: "Administrateur non trouvé." });
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(adminPassword, adminUser.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe administrateur incorrect." });
    }
    
    res.status(200).json({ message: "Mot de passe vérifié avec succès." });
  } catch (err) {
    console.error('Erreur verify_admin_password:', err);
    res.status(500).json({ error: "Erreur lors de la vérification du mot de passe." });
  }
}

module.exports = {
  get_users,
  get_user_by_id,
  create_user,
  update_user,
  delete_user,
  delete_user_secure,
  get_my_profile,
  login,
  change_password,
  verify_admin_password
};