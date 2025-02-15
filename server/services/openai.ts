import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

const client = new OpenAI({
    baseURL: "https://api.scaleway.ai/854272bf-550a-4ea8-96fc-020b40fb50a3/v1",
    apiKey: process.env.SCW_SECRET_KEY, // Récupération de la clé API depuis .env
});

/**
 * Générer une réponse IA à partir des données d'urgence fournies.
 * @param {string} emergencyData - Texte décrivant l'urgence.
 * @returns {Promise<string>} - Réponse de l'IA.
 */
export async function generateAIResponse(emergencyData: string): Promise<string> {
    try {
        const response = await client.chat.completions.create({
            model: "mistral-nemo-instruct-2407",
            messages: [
                { role: "system", content: "You are an AI specialized in emergency triage. Analyze the following data and provide insights."},
                { role: "user", content: emergencyData },
            ],
            max_tokens: 512,
            temperature: 0.3,
            top_p: 1,
            presence_penalty: 0,
            stream: false, // Ne pas utiliser de streaming
        });

        return response.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw new Error("Failed to generate AI response.");
    }
}
