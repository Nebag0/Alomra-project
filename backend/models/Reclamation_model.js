const db = require('../config/connexion_db'); // adapte selon ton fichier de connexion

// Créer une réclamation et lier les motifs
async function createReclamation(data, motifIds) {
    const [result] = await db.execute(
        `INSERT INTO reclamations 
        (nom_agent, prenom_agent, cin_agent, description, date_reclamation, site_affectation, poste, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.nom_agent,
            data.prenom_agent,
            data.cin_agent,
            data.description,
            data.date_reclamation,
            data.site_affectation,
            data.poste,
            data.created_by
        ]
    );
    const reclamationId = result.insertId;

    // Lier les motifs
    for (const motifId of motifIds) {
        await db.execute(
            `INSERT INTO reclamation_motif (reclamation_id, motif_id) VALUES (?, ?)`,
            [reclamationId, motifId]
        );
    }
    return reclamationId;
}

// Récupérer toutes les réclamations avec leurs motifs
async function getAllReclamations() {
    const [rows] = await db.execute(`
        SELECT r.*, GROUP_CONCAT(m.nom) AS motifs
        FROM reclamations r
        LEFT JOIN reclamation_motif rm ON r.id = rm.reclamation_id
        LEFT JOIN motifs m ON rm.motif_id = m.id
        GROUP BY r.id
    `);
    return rows;
}

async function get_all_reclamations() {
  const [rows] = await db.query(`
    SELECT 
      r.*, 
      u.nom AS superviseur_nom, 
      u.prenom AS superviseur_prenom
    FROM reclamations r
    LEFT JOIN users u ON r.created_by = u.id_user
    ORDER BY r.id DESC
  `);
  return rows;
}

// Récupérer les réclamations d'un superviseur
async function getReclamationsByUser(userId) {
    const [rows] = await db.execute(`
        SELECT r.*, GROUP_CONCAT(m.nom) AS motifs
        FROM reclamations r
        LEFT JOIN reclamation_motif rm ON r.id = rm.reclamation_id
        LEFT JOIN motifs m ON rm.motif_id = m.id
        WHERE r.created_by = ?
        GROUP BY r.id
        ORDER BY r.id DESC
    `, [userId]);
    return rows;
}

async function existsReclamation(cin_agent, date_reclamation) {
    const [rows] = await db.execute(
        'SELECT id FROM reclamations WHERE cin_agent = ? AND date_reclamation = ?',
        [cin_agent, date_reclamation]
    );
    return rows.length > 0;
}

// Mettre à jour une réclamation
async function updateReclamation(id, data) {
    await db.execute(
        `UPDATE reclamations SET nom_agent=?, prenom_agent=?, cin_agent=?, description=?, date_reclamation=?, site_affectation=?, poste=?, created_by=? WHERE id=?`,
        [
            data.nom_agent,
            data.prenom_agent,
            data.cin_agent,
            data.description,
            data.date_reclamation,
            data.site_affectation,
            data.poste,
            data.created_by,
            id
        ]
    );
    // Pour les motifs, il faut d'abord supprimer les anciens puis insérer les nouveaux
    if (Array.isArray(data.motifIds)) {
        await db.execute('DELETE FROM reclamation_motif WHERE reclamation_id=?', [id]);
        for (const motifId of data.motifIds) {
            await db.execute(
                `INSERT INTO reclamation_motif (reclamation_id, motif_id) VALUES (?, ?)`,
                [id, motifId]
            );
        }
    }
}

// Supprimer une réclamation
async function deleteReclamation(id) {
    await db.execute('DELETE FROM reclamation_motif WHERE reclamation_id=?', [id]);
    await db.execute('DELETE FROM reclamations WHERE id=?', [id]);
}

// Récupérer une réclamation par son ID
// async function getReclamationById(id) {
//     const [rows] = await db.execute(
//         `SELECT r.*, GROUP_CONCAT(m.nom) AS motifs
//          FROM reclamations r
//          LEFT JOIN reclamation_motif rm ON r.id = rm.reclamation_id
//          LEFT JOIN motifs m ON rm.motif_id = m.id
//          WHERE r.id = ?
//          GROUP BY r.id`,
//         [id]
//     );
//     return rows[0];
// }

async function getReclamationById(id) {
    const [rows] = await db.query(`
      SELECT r.*, u.nom AS superviseur_nom, u.prenom AS superviseur_prenom
      FROM reclamations r
      LEFT JOIN users u ON r.created_by = u.id_user
      WHERE r.id = ?
      LIMIT 1
    `, [id]);
    // if (rows.length === 0) return res.status(404).json({ error: "Réclamation non trouvée" });
    // res.json(rows[0]);
    return rows[0];
}

module.exports = {
    createReclamation,
    getAllReclamations,
    getReclamationsByUser,
    existsReclamation,
    updateReclamation,
    deleteReclamation,
    getReclamationById,
    get_all_reclamations // pour admin
};

