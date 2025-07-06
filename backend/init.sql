-- Initialisation de la base de données Alomra
USE alomra;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superviseur') DEFAULT 'superviseur',
    photo VARCHAR(255)
);

-- Table des motifs
CREATE TABLE IF NOT EXISTS motifs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) UNIQUE NOT NULL
);

-- Table des réclamations
CREATE TABLE IF NOT EXISTS reclamations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom_agent VARCHAR(100) NOT NULL,
    prenom_agent VARCHAR(100) NOT NULL,
    cin_agent VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    date_reclamation DATE NOT NULL,
    site_affectation VARCHAR(100) NOT NULL,
    poste VARCHAR(100) NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id_user)
);

-- Table de liaison réclamation-motif
CREATE TABLE IF NOT EXISTS reclamation_motif (
    reclamation_id INT NOT NULL,
    motif_id INT NOT NULL,
    PRIMARY KEY (reclamation_id, motif_id),
    FOREIGN KEY (reclamation_id) REFERENCES reclamations(id),
    FOREIGN KEY (motif_id) REFERENCES motifs(id)
);

-- Insertion de l'utilisateur admin par défaut
-- Email: admin@admin.com, Mot de passe: adminadmin (hashé avec bcrypt)
INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES 
('Admin', 'System', 'admin@admin.com', '$2b$10$sCrPGXow.pPs5snj8H5yFeCMSkcvz3psjGq7tfOuYK8BQB8Y2pJbS', 'admin')
ON DUPLICATE KEY UPDATE mot_de_passe = VALUES(mot_de_passe); 