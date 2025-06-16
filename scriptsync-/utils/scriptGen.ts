import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateScript(): Promise<string> {
  const prompt = `
    Create a unique acting script with:
    - A brief dialogue between 2 characters.
    - A setting in a mysterious library.
    - Maximum 200 words.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a creative scriptwriter." },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
    });

  console.log("Response:", response);

  return response.choices?.[0]?.message?.content?.trim() || "No script generated.";
  } catch (error: any) {
    console.error("Error generating script:", error.response?.data || error.message);
    return "An error occurred while generating the script.";
  }
}
