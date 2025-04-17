import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import stegoRoutes from './routes/stego.js';
import { initDB } from './db/database.js';

const app = express();
app.use(cors());
app.use(express.json());

await initDB();

app.use('/api/auth', authRoutes);
app.use('/api/stego', stegoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
