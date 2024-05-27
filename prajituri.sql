DROP TYPE IF EXISTS CATEG_JUCARII;
DROP TYPE IF EXISTS PRODUS;
CREATE TYPE CATEG_JUCARII AS ENUM('bebelusi','baieti','fete','in aer liber','in echipa');
CREATE TYPE PRODUS AS ENUM('lego','papusi','masinute', 'jocuri_societate', 'carti','minte');
DROP TABLE JUCARIE;
CREATE TABLE IF NOT EXISTS JUCARIE (
	ID serial PRIMARY KEY,
	NUME VARCHAR(50) UNIQUE NOT NULL,																																					
    DESCRIERE TEXT, 
	PRET NUMERIC(8,2) CHECK (PRET >0) NOT NULL,
	VARSTA INT NOT NULL CHECK (VARSTA >= 0 AND VARSTA <= 100),
	TIP_PRODUS PRODUS DEFAULT 'lego',
	CATEGORIE CATEG_JUCARII DEFAULT 'baieti',																																		
   PT_EPILEPTICI BOOLEAN NOT NULL DEFAULT TRUE,
	IMAGINE VARCHAR(300),
   DATA_ADAUGARE TIMESTAMP DEFAULT CURRENT_TIMESTAMP);																																																									


INSERT INTO JUCARIE (NUME, DESCRIERE, PRET, VARSTA, TIP_PRODUS, CATEGORIE,  PT_EPILEPTICI, IMAGINE, DATA_ADAUGARE)
VALUES 
('Masinuta', 'Masinuta pentru baieti', 99.99, 3, 'masinute', 'bebelusi',  FALSE, 'masinuta.jpg', DEFAULT),
('Papusa', 'Papusa de plus', 32.99, 2,  'papusi','bebelusi',  FALSE, 'papusa.jfif', DEFAULT),
('Casa Lego', 'Casa de facut cu prietenii din 5000 de piese', 35.50, 12, 'lego',  'baieti',  FALSE, 'casa.jfif', DEFAULT),
('Masina lego', 'Masinuta perfecta pentru copilul tau la 12 ani',199.99, 12, 'lego','baieti', FALSE, 'mas-lego.jpg', DEFAULT),
('Barca lego', 'Barca perfecta pentru a-ti omori timpul.', 139.99, 12, 'lego', 'baieti',  TRUE, 'barca.jfif', DEFAULT),
('Puzzle', 'Puzzle din 1000 de piese. Succes', 68.99, 12, 'minte', 'fete', FALSE, 'puzzle.jfif', DEFAULT),
('Capybara Plus', 'Un animalut de plus numai bun pentru copii.', 25.67, 3, 'papusi',  'fete', FALSE, 'capybara.jfif', DEFAULT),
('Cub Rubik', 'Numai bun pentru a-ti lucra mintea.', 12.99, 7, 'minte', 'baieti', FALSE, 'cub.jfif', DEFAULT),
('Balon', 'Baloane perfecte pentru o zi de nastere.', 8.00, 7,   'minte', 'in aer liber', FALSE, 'balon.jpg', DEFAULT),
('Uno', 'Joaca-te cu prietenii.', 20.00, 7, 'carti', 'in aer liber', TRUE, 'uno.jfif', DEFAULT),
('Activity', 'Un joc foarte bun cand esti cu prietenii.', 70.99, 12, 'jocuri_societate',  'in echipa',  FALSE, 'activity.jfif', DEFAULT),
('Carti de joc', 'Vrei sa te apuci de magie sau de macao. Atunci acest set este numai bun ca sa incepi. ', 5.00, 7, 'carti',  'in echipa', FALSE, 'cart.jpg', DEFAULT),
('Monopoly', 'Un joc in care prietnii se tradeaza pe la sapte si banaca e corupta.', 78.99, 7, 'jocuri_societate','in aer liber',   FALSE, 'monopoly.jfif', DEFAULT),
('Remy', 'Numai bun de jucat cu prietenii.', 20.50, 7, 'jocuri_societate','in aer liber', FALSE, 'remy.jpg', DEFAULT),
('Catan', 'Un joc de strategie numai bun pentru o vineri seara.', 48.99, 7, 'jocuri_societate',  'baieti',  FALSE, 'catan.jpg', DEFAULT),
('Sah', 'Pune-ti mintea la contributie intr-un meci de sah.', 18.50, 5, 'minte', 'in aer liber',  FALSE, 'sah.jfif', DEFAULT),
('Stitch', 'Foarte adorabil potrivit pentru fetite si baietei.', 12.00, 2, 'papusi',  'bebelusi',  FALSE, 'stitch.jfif', DEFAULT),
('Jenga', 'Un joc in care transpiri la propriu', 14.00, 5, 'minte', 'in aer liber', TRUE,'jenga.jfif', DEFAULT),
('Dixit', 'Un joc numai bun pentru a-l incerca c prietenii.', 80.00, 7, 'jocuri_societate',  'in aer liber',  FALSE, 'dixit.jfif', DEFAULT),
('Lego Dragon', 'Contine 200 de piese. Asa ca ai rabdare.', 500.00, 12, 'lego',  'baieti',  FALSE, 'dragon.jfif', DEFAULT),
('Bowser', 'Contine 3000 de piese asa ca ai rabdare.', 255.99, 12, 'lego', 'baieti', FALSE, 'mario.jfif', DEFAULT)
