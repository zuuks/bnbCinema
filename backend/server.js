require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
console.log("✅ Express aplikacija je pokrenuta..."); // Provera da li se kod izvršava

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);


// GET Reviews (Dohvatanje recenzija po filmId)
app.get('/reviews', (req, res) => {
    const { filmId } = req.query;
    if (!filmId) {
      return res.status(400).send('filmId je obavezan');
    }
  
    db.query('SELECT * FROM reviews WHERE filmId = ?', [filmId], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });
  
  // POST Review (Dodavanje recenzije)
  app.post('/reviews', (req, res) => {
    const { filmId, username, rating, comment } = req.body;
    if (!filmId || !username || !rating || !comment) {
      return res.status(400).send('Sva polja su obavezna');
    }
  
    const query = 'INSERT INTO reviews (filmId, username, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(query, [filmId, username, rating, comment], (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).send('Recenzija sačuvana');
    });
  });
  
  // DELETE Reviews (Brisanje svih recenzija za film)
  app.delete('/reviews', (req, res) => {
    const { filmId } = req.query;
    if (!filmId) return res.status(400).send('filmId je obavezan');
  
    db.query('DELETE FROM reviews WHERE filmId = ?', [filmId], (err, result) => {
      if (err) return res.status(500).json(err);
      res.send('Recenzije obrisane');
    });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pokrenut na portu ${PORT}`));
