import { Ollama } from 'ollama';
import dotenv from 'dotenv';

dotenv.config();

const OLLA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

const ollama = new Ollama({
    host: OLLA_URL,
})

const dataFAQ = `
    INFORMASI RESTORANKU:
    - Jam Operasional: Senin - Sabtu, pukul 10:00 sampai 22:00 WIB. Hari Minggu libur.
    - Lokasi: Central Park Mall, Jakarta Barat.
    - Menu: 
        - Makanan: Nasi Goreng Spesial, Mie Goreng Seafood Ayam Bakar Madu, Sate Ayam, Gado-gado Jakarta, Lumpia Goreng, Sop Buntut, Kentang Goreng, Pisang Goreng Keju, Brownies Coklat, Pancake Maple, Es Krim Tiga Rasa.
        - Minuman: Es Kopi Susu, Americano, Matcha Latte, Es Teh Manis, Jus Alpukat, Jus Jeruk, Mango Smoothie, Es Teler.
`;

export const AIChat = async (req, res) => {
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
}