const Reclamation = require('../models/Reclamation_model');

create_reclamation = async (req, res) => {
    try {
        const data = req.body;
        const motifIds = data.motifIds; // tableau d'IDs de motifs
        if (!Array.isArray(motifIds) || motifIds.length === 0) {
            return res.status(400).json({ error: "motifIds est requis et doit être un tableau non vide." });
        }
        const reclamationId = await Reclamation.createReclamation(data, motifIds);
        res.status(201).json({ message: "Réclamation créée", reclamationId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

get_reclamations = async (req, res) => {
    try {
        const rows = await Reclamation.getAllReclamations();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    create_reclamation,
    get_reclamations
};