import dotenv from 'dotenv';
import { GoogleGenerativeAI, GoogleGenerativeAIError } from '@google/generative-ai';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
const GOOGLE_GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL?.trim() || 'gemini-3.5-flash';

if (!GOOGLE_API_KEY) {
    throw new Error('Env var GOOGLE_API_KEY must be set to use Google Gemini integration.');
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: GOOGLE_GEMINI_MODEL });

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

    if (lowerMessage.includes('unauthorized') || lowerMessage.includes('api key') || lowerMessage.includes('401')) {
        return 'Kunci Google API tidak valid atau belum disetel. Periksa GOOGLE_API_KEY.';
    }

    if (lowerMessage.includes('model') && lowerMessage.includes('not found')) {
        return `Model Gemini "${GOOGLE_GEMINI_MODEL}" tidak ditemukan. Periksa nama model di GOOGLE_GEMINI_MODEL atau gunakan model yang tersedia.`;
    }

    return `Gagal memproses chat dengan model "${GOOGLE_GEMINI_MODEL}". ${errorMessage}`;
};

const extractReply = (response) => {
    const candidate = response?.response?.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];
    return parts
        .map((part) => typeof part?.text === 'string' ? part.text : '')
        .filter(Boolean)
        .join(' ')
        .trim();
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

        const response = await geminiModel.generateContent({
            systemInstruction: SYSTEM_PROMPT,
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userMessage }],
                },
            ],
        });

        const reply = extractReply(response);

        if (!reply) {
            throw new Error('Respons Gemini kosong.');
        }

        return res.status(200).json({
            reply,
            model: GOOGLE_GEMINI_MODEL
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
