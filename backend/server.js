require('dotenv').config();
const db = require('./config/db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');

const app = express();
console.log("Express aplikacija je pokrenuta...");

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error('Nema tokena u zahtevu!');
        return res.status(401).json({ message: "Nema tokena, neautorizovan pristup" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Dekodirani JWT token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        return res.status(401).json({ message: "Nevažeći token" });
    }
};

app.get('/reviews', (req, res) => {
    const { filmId, email } = req.query;

    if (!filmId) {
        return res.status(400).send('filmId je obavezan');
    }

    let query = 'SELECT username, email, rating, comment FROM reviews WHERE filmId = ?';
    let queryParams = [filmId];

    // Ako postoji email u query-u, filtriraj recenzije samo za tog korisnika
    if (email) {
        query += ' AND email = ?';
        queryParams.push(email);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('❌ Greška pri dohvatanju recenzija:', err);
            return res.status(500).json({ message: 'Greška pri dohvatanju recenzija.' });
        }

        res.json(results);
    });
});


app.post('/reviews', authenticateUser, (req, res) => {
    console.log('Podaci primljeni na backend:', req.body);

    const { filmId, rating, comment } = req.body;
    const { username, email } = req.user;

    if (!filmId || !rating || !comment || !username || !email) {
        console.error('Nedostaju podaci:', { filmId, username, rating, comment });
        return res.status(400).send('Sva polja su obavezna');
    }

    const query = 'INSERT INTO reviews (filmId, username, email, rating, comment) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [filmId, username, email, rating, comment], (err) => {
        if (err) {
            console.error('Greška pri dodavanju recenzije:', err, { filmId, username, email, rating, comment });
            return res.status(500).json(err);
        }
        res.status(201).json({ message: 'Recenzija sačuvana' });
    });
});

app.delete('/reviews', (req, res) => {
    const { filmId } = req.query;
    if (!filmId) return res.status(400).send('filmId je obavezan');

    db.query('DELETE FROM reviews WHERE filmId = ?', [filmId], (err, result) => {
        if (err) {
            console.error('Greška pri brisanju recenzija:', err);
            return res.status(500).json(err);
        }
        res.send('Recenzije obrisane');
    });
});

app.post('/api/rezervacije', authenticateUser, (req, res) => {
    console.log('Primljen zahtev za čuvanje rezervacija:', req.body);

    const { rezervacije } = req.body;
    const { username, email } = req.user;

    if (!rezervacije || !Array.isArray(rezervacije) || rezervacije.length === 0) {
        return res.status(400).json({ message: 'Nema rezervacija za čuvanje.' });
    }

    const query = `INSERT INTO reservations (username, email, film_title, broj_karata, datum) VALUES ?`;

    const values = rezervacije.map(rez => [
        username, 
        email, 
        rez.film.title, 
        rez.brojKarata, 
        rez.datum
    ]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Greška pri čuvanju rezervacija:', err);
            return res.status(500).json({ message: 'Greška pri čuvanju rezervacija.' });
        }

        console.log(`Uspešno sačuvane rezervacije za korisnika ${username} (${email})`);
        res.status(201).json({ message: 'Rezervacije uspešno sačuvane!' });
    });
});

app.get('/api/rezervacije', authenticateUser, (req, res) => {
    const { email } = req.user;

    db.query('SELECT id, film_title, broj_karata, datum FROM reservations WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Greška pri dohvatanju rezervacija:', err);
            return res.status(500).json({ message: 'Greška pri dohvatanju rezervacija.' });
        }

        if (results.length === 0) {
            return res.json([]);  
        }

        res.json(results);
    });
});


app.delete('/api/rezervacije/:id', authenticateUser, (req, res) => {
    const { id } = req.params;
    const { email } = req.user;

    db.query('DELETE FROM reservations WHERE id = ? AND email = ?', [id, email], (err, result) => {
        if (err) {
            console.error('Greška pri brisanju rezervacije:', err);
            return res.status(500).json({ message: 'Greška pri brisanju rezervacije.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rezervacija nije pronađena ili ne pripada korisniku.' });
        }

        console.log(`Rezervacija sa ID ${id} obrisana za korisnika ${email}`);
        res.json({ message: 'Rezervacija uspešno obrisana!' });
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
