import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateToken } from './api/token.ts';
import { AIChat } from './api/ai-chat.ts';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/ai-chat', AIChat);

app.post('/api/token', generateToken)

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
