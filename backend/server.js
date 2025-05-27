require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
  process.exit(1);
}

connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use('/api/user', userRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
