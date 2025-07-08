const Reclamation = require('../models/Reclamation_model');
const db = require('../config/connexion_db');

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
        const search = req.query.search || '';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const { reclamations, total } = await Reclamation.getReclamationsByUserWithSearchAndPagination({ userId, search, limit, offset });
        res.json({ reclamations, total, page, limit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pour les admins : récupérer toutes les réclamations
get_all_reclamations = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const { reclamations, total } = await Reclamation.getAllReclamationsWithSearchAndPagination({ search, limit, offset });
    res.json({ reclamations, total, page, limit });
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
// async function get_reclamation_by_id(req, res) {
//     const { id } = req.params;
//     try {
//         const reclamation = await Reclamation.getReclamationById(id);
//         if (reclamation) {
//             res.status(200).json(reclamation);
//         } else {
//             res.status(404).json({ error: "Réclamation non trouvée." });
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

get_reclamation_by_id = async (req, res) => {
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
};

get_reclamations_essentielles = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    // Si superviseur, filtrer par userId
    const userId = req.user.role === 'superviseur' ? req.user.id : null;
    const { reclamations, total } = await Reclamation.getReclamationsEssentiellesWithSearchAndPagination({ search, limit, offset, userId });
    res.json({ reclamations, total, page, limit });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

get_motifs = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, nom FROM motifs ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statistiques : nombre de réclamations par mois
get_reclamations_stats_by_month = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DATE_FORMAT(date_reclamation, '%Y-%m') as mois, COUNT(*) as count
      FROM reclamations
      GROUP BY mois
      ORDER BY mois
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statistiques : nombre de réclamations par superviseur
get_reclamations_stats_by_superviseur = async (req, res) => {
  try {
    let where = '';
    let params = [];
    if (req.query.superviseur) {
      where = 'WHERE r.created_by = ?';
      params.push(req.query.superviseur);
    }
    const [rows] = await db.execute(`
      SELECT u.nom, u.prenom, COUNT(*) as count
      FROM reclamations r
      LEFT JOIN users u ON r.created_by = u.id_user
      ${where}
      GROUP BY r.created_by
      ORDER BY count DESC
    `, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    create_reclamation,
    get_reclamations_by_user,
    get_all_reclamations,
    update_reclamation,
    delete_reclamation,
    get_reclamation_by_id,
    get_reclamations_essentielles,
    get_motifs,
    get_reclamations_stats_by_month,
    get_reclamations_stats_by_superviseur
};