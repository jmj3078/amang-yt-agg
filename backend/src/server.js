import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import parseRouter from './routes/parse.js';
import errorMiddleware from './middleware/error.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/parse', parseRouter);
app.use(errorMiddleware);

app.get('/', (req, res) => res.redirect('/api/parse/public'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
