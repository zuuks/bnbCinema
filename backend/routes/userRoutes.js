const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Postavi svog korisnika baze
  password: '',  // Postavi šifru baze ako je imaš
  database: 'auth_db'
});

// ✅ Endpoint za ažuriranje korisničkih podataka
router.put('/update-user', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email je obavezan' });
  }

  let updateQuery = 'UPDATE users SET ';
  const updateValues = [];

  if (username) {
    updateQuery += 'name = ?, ';
    updateValues.push(username);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateQuery += 'password = ?, ';
    updateValues.push(hashedPassword);
  }

  updateQuery = updateQuery.slice(0, -2) + ' WHERE email = ?';
  updateValues.push(email);

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error('❌ Greška pri ažuriranju podataka:', err);
      return res.status(500).json({ message: 'Greška pri ažuriranju podataka' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Korisnik nije pronađen' });
    }

    res.json({ message: 'Podaci uspešno ažurirani!' });
  });
});

module.exports = router;
