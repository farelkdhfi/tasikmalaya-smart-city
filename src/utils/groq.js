import Groq from "groq-sdk";

const LOREM_API = import.meta.env.VITE_LOREM;

const groq = new Groq({
    apiKey: LOREM_API,
    dangerouslyAllowBrowser: true
});

// System Prompt: Identitas dasar AI
const SYSTEM_PROMPT = {
    role: "system",
    content: "Kamu adalah Tasik AI, asisten virtual cerdas untuk Smart City Tasikmalaya. Jawablah dengan sopan, ringkas, dan membantu. Gunakan Bahasa Indonesia yang baik."
};

// Fungsi request sekarang menerima 'messageHistory' (Array)
export const request = async (messageHistory) => {
    try {
        const reply = await groq.chat.completions.create({
            // Gabungkan System Prompt dengan History Chat
            messages: [
                SYSTEM_PROMPT,
                ...messageHistory
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7, // Sedikit kreatif tapi tetap faktual
            max_tokens: 1024,
        });

        return reply.choices[0].message.content;

    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};