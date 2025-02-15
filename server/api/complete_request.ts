import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    baseURL: "https://api.scaleway.ai/854272bf-550a-4ea8-96fc-020b40fb50a3/v1",
    apiKey: process.env.SCW_SECRET_KEY
});

async function complete_request() {
  const stream = await client.chat.completions.create({
    model:"mistral-nemo-instruct-2407",
    messages: [
        { "role": "system", "content": "You are a helpful assistant" },
		{ "role": "user", "content": "" },
    ],
    max_tokens: 512,
    temperature: 0.3,
    top_p: 1,
    presence_penalty: 0,
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

complete_request();