const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    console.log("📌 Signup zahtev primljen:", req.body);
    const { name, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: 'Email je već registrovan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword], 
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Greška pri registraciji' });
                res.status(201).json({ message: 'Korisnik uspešno registrovan' });
            }
        );
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (result.length === 0) {
            return res.status(400).json({ message: 'Neispravan email ili lozinka' });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Neispravan email ili lozinka' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    });
};
