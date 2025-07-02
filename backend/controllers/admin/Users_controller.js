const User = require('../../models/admin/Users_models');

// Récupérer tous les utilisateurs
async function get_users(req, res) {
  try {
    const users = await User.getUsers();
    res.status(200).json(users);
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
  const { nom, prenom, email, mot_de_passe, role, photo } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe) {
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

    const userId = await User.createUser({ nom, prenom, email, mot_de_passe, role, photo });
    res.status(201).json({ message: "Utilisateur créé avec succès.", userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Modifier un utilisateur
async function update_user(req, res) {
  const { nom, prenom, email, mot_de_passe, role, photo } = req.body;
  const { id } = req.params;

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
  }

  try {
    await User.updateUser(id, { nom, prenom, email, mot_de_passe, role, photo });
    res.status(200).json({ message: "Utilisateur modifié avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Supprimer un utilisateur
async function delete_user(req, res) {
  const { id } = req.params;
  try {
    await User.deleteUser(id);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  get_users,
  get_user_by_id,
  create_user,
  update_user,
  delete_user
};