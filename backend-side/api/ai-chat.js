import { Ollama } from 'ollama';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL?.trim() || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL?.trim() || 'llama3.2:latest';

const ollama = new Ollama({
    host: OLLAMA_URL,
});

const dataFAQ = `
    INFORMASI RESTORANKU:
    - Jam Operasional: Senin - Sabtu, pukul 10:00 sampai 22:00 WIB. Hari Minggu libur.
    - Lokasi: Central Park Mall, Jakarta Barat.
    - Menu: 
        - Makanan: Nasi Goreng Spesial, Mie Goreng Seafood, Ayam Bakar Madu, Sate Ayam, Gado-gado Jakarta, Lumpia Goreng, Sop Buntut, Kentang Goreng, Pisang Goreng Keju, Brownies Coklat, Pancake Maple, Es Krim Tiga Rasa.
        - Minuman: Es Kopi Susu, Americano, Matcha Latte, Es Teh Manis, Jus Alpukat, Jus Jeruk, Mango Smoothie, Es Teler.
`;

const SYSTEM_PROMPT = `Kamu adalah asisten pelanggan Restoran yang ramah.
Gunakan informasi berikut untuk menjawab pertanyaan pelanggan:
${dataFAQ}

Jika pertanyaan di luar konteks tersebut, jawab bahwa kamu tidak tahu dan sarankan untuk bertanya langsung kepada pelayan.`;

const getReadableError = (error) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const lowerMessage = errorMessage.toLowerCase();

    if (
        lowerMessage.includes('fetch failed') ||
        lowerMessage.includes('econnrefused') ||
        lowerMessage.includes('connect')
    ) {
        return `Tidak bisa terhubung ke Ollama di ${OLLAMA_URL}. Pastikan aplikasi Ollama aktif dan host-nya benar.`;
    }

    if (lowerMessage.includes('model') && lowerMessage.includes('not found')) {
        return `Model Ollama "${OLLAMA_MODEL}" belum tersedia. Silakan pull atau ganti model yang terpasang.`;
    }

    return `Gagal memproses chat dengan model "${OLLAMA_MODEL}". ${errorMessage}`;
};

export const AIChat = async (req, res) => {
    try {
        const userMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

        if (!userMessage) {
            return res.status(400).json({
                error: 'Pesan tidak boleh kosong.',
                reply: 'Pesan tidak boleh kosong.'
            });
        }

        const response = await ollama.chat({
            model: OLLAMA_MODEL,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            stream: false,
            options: {
                temperature: 0.7,
            }
        });

        const reply = response?.message?.content?.trim();

        if (!reply) {
            throw new Error('Respons Ollama kosong.');
        }

        return res.status(200).json({
            reply,
            model: OLLAMA_MODEL
        });
    } catch (error) {
        console.error('--- ERROR AI CHAT ---');
        console.error(error);

        const message = getReadableError(error);

        return res.status(502).json({
            error: message,
            reply: message
        });
    }
};
