import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateToken } from './api/token.js';
import { AIChat } from './api/ai-chat.js';
import prisma from './db/prisma.js';
import { createNewMenu, createNewOrder, createPayment, deleteMenu, getAllMenus, getAllOrders, getMenuById, getOrder, getPayment, updateMenu } from './api/crud-menu.js';

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:5173', 'https://menu-resto-client.vercel.app'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));
app.use(cors())
await prisma.$connect();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/api/ai-chat', AIChat);

app.post('/api/token', generateToken);

app.post('/create-new-menus', createNewMenu);

app.get('/get-all-menus', getAllMenus);

app.get('/get-menu/:id', getMenuById);

app.post('/update-menu/:id', updateMenu);

app.delete('/delete-menu/:id', deleteMenu);

app.get('/get-all-orders', getAllOrders);

app.get('/get-order/:id', getOrder);

app.post('/create-new-orders', createNewOrder);

app.post('/create-payment', createPayment);

app.get('/get-payment/:id', getPayment);

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
