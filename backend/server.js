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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pokrenut na portu ${PORT}`));
