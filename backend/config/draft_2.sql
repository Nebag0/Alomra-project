CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superviseur') DEFAULT 'superviseur',
    photo VARCHAR(255)
);

CREATE TABLE motifs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE reclamations (
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

CREATE TABLE reclamation_motif (
    reclamation_id INT NOT NULL,
    motif_id INT NOT NULL,
    PRIMARY KEY (reclamation_id, motif_id),
    FOREIGN KEY (reclamation_id) REFERENCES reclamations(id),
    FOREIGN KEY (motif_id) REFERENCES motifs(id)
);

