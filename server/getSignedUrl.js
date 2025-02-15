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

generateSignedUrl();
