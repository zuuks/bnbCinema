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
        if (err) {
            console.error('❌ Greška pri pretrazi korisnika:', err);
            return res.status(500).json({ message: 'Greška na serveru' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Neispravan email ili lozinka' });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Neispravan email ili lozinka' });
        }

        // ✅ Proveravamo da li `name` postoji
        if (!user.name) {
            console.error('❌ Greška: Korisničko ime (name) nije pronađeno u bazi!');
            return res.status(500).json({ message: 'Greška: Korisničko ime nije pronađeno' });
        }

        // ✅ Generišemo JWT token sa `name`
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.name }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        console.log('✅ Korisnik uspešno prijavljen:', { id: user.id, email: user.email, username: user.name });
        res.json({ token });
    });
};



exports.logout = (req, res) => {
    res.json({ message: "Uspešno ste se odjavili" });

};