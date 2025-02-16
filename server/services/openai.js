import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import OpenAI from "openai";
import dotenv from "dotenv";
import { json } from "express";

dotenv.config(); // Charger les variables d'environnement

const s3 = new S3Client({
	region: process.env.SCW_DEFAULT_REGION,
	endpoint: `https://s3.${process.env.SCW_DEFAULT_REGION}.scw.cloud`, 
	credentials: {
	accessKeyId: process.env.SCW_ACCESS_KEY,
	secretAccessKey: process.env.SCW_SECRET_KEY,
	},
});

let jsonData = await fetchSignedJson();

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
	// console.log(data);
	const jsonString = JSON.stringify(data, null, 2);
	// console.log(jsonString)

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
		console.log(emergencyData);
		const messageContent = `
        **🔴 Patient form :**
        ${emergencyData}

        **🏥 Hospitals data : **
        ${jsonData}
        `;

		const prePompt = `
You are an AI assistant specializing in emergency triage and hospital selection.
Your task is to analyze a patient form and list of hospitals and rank them in a .json format based on the following three criteria:
- Availability : Only consider hospitals where "available": true
- Specialty Match : The hospital must provide the required specialty based on the patient's medical condition.  
- Proximity : closeness from the patient’s location.

Example of expected output :
{
  "1":
    {
      "name": "Hôpital Européen Georges Pompidou AP-HP",
      "geo": "48.840324299939184, 2.2721945783639392",
      "specialities": ["Cardiology & Vascular Medicine", "Neurology & Neurosurgery"],
      "address": "20 Rue Leblanc, 75015 Paris"
    },
    "2":
     {
      "name": "Hôpital Saint-Antoine",
      "geo": "48.847011, 2.386498",
      "specialities": ["Orthopedic & Trauma Surgery", "Pulmonology & Respiratory Medicine"],
      "address": "184 Rue du Faubourg Saint-Antoine, 75012 Paris"
    },
    "3":
	{
    "name": "Hôpital Européen Georges Pompidou AP-HP",
    "geo": "48.840324299939184, 2.2721945783639392",
    "specialities": [
      "Cardiology & Vascular Medicine",
      "Endocrinology & Diabetology",
      "Gastroenterology & Hepatology",
      "Geriatrics"
    ],
    "address": "20 Rue Leblanc, 75015 Paris"
  },
     "4":
{
    "name": "Hôpital Vaugirard AP-HP",
    "geo": "48.8345683650467, 2.293561757610877",
    "specialities": [
      "Dietetic,  Neuropsychology, psychiatry, rehabilitayion, chipology"
    ],
    "address": "10 Rue Vaugelas, 75015 Paris"
  },
}
  ONLY OUTPUT THE .JSON FILE !!
  LIMIT YOURSELF TO FOUR HOSPITALS !!
`;
        const response = await client.chat.completions.create({
            model: "mistral-nemo-instruct-2407",
            messages: [
                { role: "system", content: prePompt},
				{role: "user", content: messageContent}
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




