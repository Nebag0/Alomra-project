const admin_model = require('../models/Users_models');

get_user = async (req, res) => {
  try {
    const userData = await admin_model.get_user();
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des données');
  }
}

get_user_by_id = async (req, res) => {
  try {
    const user = await admin_model.get_user_by_id(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des données');
  }
}

create_user = async (req, res) => {
  try {
    const newUser = await admin_model.create_user(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création de l\'utilisateur');
  }
}

module.exports = { get_user, get_user_by_id, create_user };