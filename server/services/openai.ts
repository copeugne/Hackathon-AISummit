import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.scaleway.ai/854272bf-550a-4ea8-96fc-020b40fb50a3/v1",
  apiKey: "SCW_SECRET_KEY" // Replace SCW_SECRET_KEY with your IAM API key
});

export async function generateAIResponse(emergencyData: string): Promise<string> {
  try {
    const stream = await client.chat.completions.create({
      model: "llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: "Tu parles francais" },
        { role: "user", content: emergencyData },
      ],
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.75,
      presence_penalty: 0,
      stream: true,
    });

    let response = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      response += content;
    }
    return response;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}