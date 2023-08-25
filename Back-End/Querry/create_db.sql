DROP TABLE IF EXISTS ReservationCoiffure;
DROP TABLE IF EXISTS CoiffeurCoiffure;
DROP TABLE IF EXISTS Coiffure;
DROP TABLE IF EXISTS TypeCoiffure;
DROP TABLE IF EXISTS Reservation;
DROP TABLE IF EXISTS Disponibilite;
DROP TABLE IF EXISTS Localisation;
DROP TABLE IF EXISTS Coiffeur;
DROP TABLE IF EXISTS Utilisateur;
DROP TABLE IF EXISTS TypeUtilisateur;

CREATE TABLE TypeUtilisateur(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(60) NOT NULL
) ENGINE = INNODB;

CREATE TABLE Utilisateur(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(60) NOT NULL,
    prenom VARCHAR(60) NOT NULL,
    username VARCHAR(60) NOT NULL UNIQUE,
    mail VARCHAR(60) NOT NULL UNIQUE,
    tel INT UNSIGNED,
    pp_link VARCHAR(255),
    mdp VARCHAR(100) NOT NULL,
    addr VARCHAR(255) NOT NULL,
    id_type INT UNSIGNED NOT NULL,
    CONSTRAINT utlr_type FOREIGN KEY(id_type) REFERENCES TypeUtilisateur(id)
) ENGINE = INNODB;

CREATE TABLE Coiffeur(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    langue VARCHAR(60) NOT NULL,
    dispo SET("temps plein", "temps partiel") NOT NULL,
    debut_exp Date NOT NULL,
    fin_exp Date NOT NULL,
    zone_mob TEXT,
    descrt text,
    id_utlr INT UNSIGNED NOT NULL,
    CONSTRAINT hairds_usr FOREIGN KEY(id_utlr) REFERENCES Utilisateur(id)
) ENGINE = INNODB;

CREATE TABLE Disponibilite(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    date_dispo DATETIME NOT NULL,
    id_coifr INT UNSIGNED NOT NULL,
    CONSTRAINT dispo_utlr FOREIGN KEY(id_coifr) REFERENCES Coiffeur(id)
) ENGINE INNODB;

CREATE TABLE Reservation(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    date_rsv DATETIME NOT NULL,
    date_rdv DATETIME NOT NULL,
    moblt SET("dom_utlr", "dom_coifr") NOT NULL,
    etat SET('accepte', 'refuse', 'attente') DEFAULT 'attente' NOT NULL,
    montant INT UNSIGNED NOT NULL,
    id_utlr  INT UNSIGNED NOT NULL,
    id_coifr INT UNSIGNED NOT NULL,
    CONSTRAINT rsv_utlr FOREIGN KEY(id_utlr) REFERENCES Utilisateur(id),
    CONSTRAINT rsv_coifr FOREIGN KEY(id_coifr) REFERENCES Coiffeur(id)
) ENGINE INNODB;

CREATE TABLE TypeCoiffure(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(60) NOT NULL
) ENGINE = INNODB;

CREATE TABLE Coiffure(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(60)NOT NULL,
    tag_list text,
    prix_moy INT UNSIGNED NOT NULL,
    temps_moy TIME NOT NULL,
    id_type INT UNSIGNED NOT NULL,
    CONSTRAINT coif_type FOREIGN KEY(id_type) REFERENCES TypeCoiffure(id)
) ENGINE = INNODB;

CREATE TABLE CoiffeurCoiffure(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    prix INT UNSIGNED NOT NULL,
    temps TIME NOT NULL,
    descrt TEXT,
    img_link VARCHAR(255),
    id_coifr INT UNSIGNED NOT NULL,
    id_coif INT UNSIGNED NOT NULL,
    CONSTRAINT coifr_coif FOREIGN KEY(id_coif) REFERENCES Coiffure(id),
    CONSTRAINT coif_coifr FOREIGN KEY(id_coifr) REFERENCES Coiffeur(id),
    UNIQUE(id_coifr, id_coif)
) ENGINE = INNODB;

CREATE TABLE ReservationCoiffure(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_rsv INT UNSIGNED NOT NULL,
    id_coif INT UNSIGNED NOT NULL,
    CONSTRAINT rsv_coif FOREIGN KEY(id_coif) REFERENCES CoiffeurCoiffure(id),
    CONSTRAINT coif_rsv FOREIGN KEY(id_rsv) REFERENCES Reservation(id),
    UNIQUE(id_rsv, id_coif)
) ENGINE = INNODB;