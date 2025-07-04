const Reclamation = require('../models/Reclamation_model');

create_reclamation = async (req, res) => {
    const {
        nom_agent, prenom_agent, cin_agent, description,
        date_reclamation, site_affectation, poste, created_by, motifIds
    } = req.body;

    // Vérifier les champs obligatoires
    if (!nom_agent || !prenom_agent || !cin_agent || !description ||
        !date_reclamation || !site_affectation || !poste || !created_by || !Array.isArray(motifIds) || motifIds.length === 0) {
        return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis et au moins un motif doit être sélectionné." });
    }

    try {
        // Vérification via le modèle
        const exists = await Reclamation.existsReclamation(cin_agent, date_reclamation);
        if (exists) {
            return res.status(409).json({ error: "Une réclamation pour cet agent à cette date existe déjà." });
        }

        // Création de la réclamation et liaison des motifs
        const reclamationId = await Reclamation.createReclamation(req.body, motifIds);
        res.status(201).json({ message: "Réclamation créée", reclamationId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pour les superviseurs : récupérer uniquement leurs propres réclamations
get_reclamations_by_user = async (req, res) => {
    try {
        const userId = req.user.id;
        const rows = await Reclamation.getReclamationsByUser(userId);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pour les admins : récupérer toutes les réclamations
get_all_reclamations = async (req, res) => {
  try {
    const rows = await Reclamation.get_all_reclamations();
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une réclamation
async function update_reclamation(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
        await Reclamation.updateReclamation(id, data);
        res.status(200).json({ message: "Réclamation modifiée avec succès." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Supprimer une réclamation
async function delete_reclamation(req, res) {
    const { id } = req.params;
    try {
        await Reclamation.deleteReclamation(id);
        res.status(200).json({ message: "Réclamation supprimée avec succès." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Obtenir une réclamation par ID
async function get_reclamation_by_id(req, res) {
    const { id } = req.params;
    try {
        const reclamation = await Reclamation.getReclamationById(id);
        if (reclamation) {
            res.status(200).json(reclamation);
        } else {
            res.status(404).json({ error: "Réclamation non trouvée." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    create_reclamation,
    get_reclamations_by_user,
    get_all_reclamations,
    update_reclamation,
    delete_reclamation,
    get_reclamation_by_id
};