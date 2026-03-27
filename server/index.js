require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policies');
const claimRoutes = require('./routes/claims');
const premiumRoutes = require('./routes/premium');

const app = express();

connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/premium', premiumRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', project: 'GigShield' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GigShield server running on port ${PORT}`));
