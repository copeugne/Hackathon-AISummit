import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.SCW_DEFAULT_REGION,
  endpoint: `https://s3.${process.env.SCW_DEFAULT_REGION}.scw.cloud`, 
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY,
    secretAccessKey: process.env.SCW_SECRET_KEY,
  },
});

async function generateSignedUrl() {
  const command = new GetObjectCommand({
    Bucket: "hackathon-equipe-26",
    Key: "data/full_corrected_hospitals.json", // Fichier à récupérer
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Expire en 1h
    console.log("Signed URL:", signedUrl);

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
    console.log("Fetched JSON Data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching signed JSON:", error);
    throw error;
  }
}

// Lancer la récupération du fichier JSON
fetchSignedJson();
