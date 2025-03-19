require('dotenv').config();
const db = require('./config/db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');

const app = express();
console.log("✅ Express aplikacija je pokrenuta...");

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

// Middleware za autentifikaciju korisnika
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error('❌ Nema tokena u zahtevu!');
        return res.status(401).json({ message: "Nema tokena, neautorizovan pristup" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('📢 Dekodirani JWT token:', decoded); // ✅ Provera da li token sadrži username
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ Greška pri dekodiranju tokena:', error);
        return res.status(401).json({ message: "Nevažeći token" });
    }
};

// GET Reviews (Dohvatanje recenzija po filmId)
app.get('/reviews', (req, res) => {
    const { filmId } = req.query;
    if (!filmId) {
        return res.status(400).send('filmId je obavezan');
    }

    db.query('SELECT username, email, rating, comment FROM reviews WHERE filmId = ?', [filmId], (err, results) => {
        if (err) {
            console.error('❌ Greška pri dohvatanju recenzija:', err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// POST Review (Dodavanje recenzije)
app.post('/reviews', authenticateUser, (req, res) => {
    console.log('📢 Podaci primljeni na backend:', req.body);

    const { filmId, rating, comment } = req.body;
    const { username, email } = req.user; // ✅ Dobijamo username iz tokena

    if (!filmId || !rating || !comment || !username || !email) {
        console.error('❌ Nedostaju podaci:', { filmId, username, rating, comment });
        return res.status(400).send('Sva polja su obavezna');
    }

    const query = 'INSERT INTO reviews (filmId, username, email, rating, comment) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [filmId, username, email, rating, comment], (err) => {
        if (err) {
            console.error('❌ Greška pri dodavanju recenzije:', err, { filmId, username, email, rating, comment });
            return res.status(500).json(err);
        }
        res.status(201).json({ message: 'Recenzija sačuvana' });

    });
});

// DELETE Reviews (Brisanje svih recenzija za film)
app.delete('/reviews', (req, res) => {
    const { filmId } = req.query;
    if (!filmId) return res.status(400).send('filmId je obavezan');

    db.query('DELETE FROM reviews WHERE filmId = ?', [filmId], (err, result) => {
        if (err) {
            console.error('❌ Greška pri brisanju recenzija:', err);
            return res.status(500).json(err);
        }
        res.send('Recenzije obrisane');
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pokrenut na portu ${PORT}`));
