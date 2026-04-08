import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Ollama } from 'ollama';
import { generateToken } from './api/token.ts';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

const ollama = new Ollama({
    host: 'http://localhost:11434',
})

const dataFAQ = `
    INFORMASI RESTORANKU:
    - Jam Operasional: Senin - Sabtu, pukul 10:00 sampai 22:00 WIB. Hari Minggu libur.
    - Lokasi: Central Park Mall, Jakarta Barat.
    - Menu: 
        - Makanan: Nasi Goreng Spesial, Mie Goreng Seafood Ayam Bakar Madu, Sate Ayam, Gado-gado Jakarta, Lumpia Goreng, Sop Buntut, Kentang Goreng, Pisang Goreng Keju, Brownies Coklat, Pancake Maple, Es Krim Tiga Rasa.
        - Minuman: Es Kopi Susu, Americano, Matcha Latte, Es Teh Manis, Jus Alpukat, Jus Jeruk, Mango Smoothie, Es Teler.
`;

app.post('/chat', async (req: Request, res: Response): Promise<void> => {
    try {
        const userMessage = req.body?.message;

        const response = await ollama.chat({
            model: "llama3.2",
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah asisten pelanggan Restoran yang ramah. 
                            Gunakan informasi berikut untuk menjawab pertanyaan: ${dataFAQ}. 
                            Jika pertanyaan di luar konteks tersebut, jawab bahwa kamu tidak tahu dan memberi tahu untuk bertanya langsung dengan pelayan.
                    `
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            options: {
                temperature: 0.7, //tingkat keakuratan
            }
        });

        res.json({ reply: response.message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Duh, sistem kami sedang istirahat sebentar." });
    }
});

app.post('/api/token', generateToken)

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
