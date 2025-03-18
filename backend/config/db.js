const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Greška pri povezivanju sa bazom:', err);
        return;
    }
    console.log('✅ Povezan sa MySQL bazom');
});


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

module.exports = db;
