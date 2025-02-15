import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

const s3 = new S3Client({
	region: process.env.SCW_DEFAULT_REGION,
	endpoint: `https://s3.${process.env.SCW_DEFAULT_REGION}.scw.cloud`, 
	credentials: {
	accessKeyId: process.env.SCW_ACCESS_KEY,
	secretAccessKey: process.env.SCW_SECRET_KEY,
	},
});

let jsonData = fetchSignedJson();

async function generateSignedUrl() {
	const command = new GetObjectCommand({
	Bucket: "hackathon-equipe-26",
	Key: "data/full_corrected_hospitals.json", // Fichier à récupérer
	});

	try {
	const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Expire en 1h
	// console.log("Signed URL:", signedUrl);

	return signedUrl;
	} catch (error) {
	console.error("Error generating signed URL:", error);
	throw error;
	}
}
  
async function fetchSignedJson() {
	try {
	// 1️⃣ Générer l’URL signée
	const signedUrl = await generateSignedUrl();

	// 2️⃣ Faire un fetch vers l'URL signée
	const response = await fetch(signedUrl);
	if (!response.ok) throw new Error(`Failed to fetch JSON: ${response.statusText}`);

	// 3️⃣ Convertir en JSON
	const data = await response.json();
	const jsonString = JSON.stringify(data, null, 2);
	// console.log("Fetched JSON Data:", data);

	return jsonString;
	} catch (error) {
	console.error("Error fetching signed JSON:", error);
	throw error;
	}
}
  

const client = new OpenAI({
    baseURL: "https://api.scaleway.ai/854272bf-550a-4ea8-96fc-020b40fb50a3/v1",
    apiKey: process.env.SCW_SECRET_KEY, // Récupération de la clé API depuis .env
});

/**
 * Générer une réponse IA à partir des données d'urgence fournies.
 * @param {string} emergencyData - Texte décrivant l'urgence.
 * @returns {Promise<string>} - Réponse de l'IA.
 */
export async function generateAIResponse(emergencyData) {
    try {

		const messageContent = `
        **🔴 Emergency :**
        ${emergencyData}

        **🏥 Hospitals data available :**
        ${jsonData}
        `;
        const response = await client.chat.completions.create({
            model: "mistral-nemo-instruct-2407",
            messages: [
                { role: "system", content: "You are an AI specialized in emergency triage. Analyze the following data and provide a list of hospitals with a score out of 10 for each one to determine their suitability for the current situation."},
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
