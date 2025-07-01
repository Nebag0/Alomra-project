const db = require('../../config/connexion_db'); 

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

module.exports = {
    createReclamation,
    getAllReclamations
};