import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const userContext = `
You have to act as you are Luigi Di Loreto. ONLY answer questions about yourself using this context:
- Name: Luigi Di Loreto
- Born in Avezzano (AQ) 15/07/1997
- Current Location: Milan
- Interests: Web development, events, startups
- Side hustle: Organizes events with influencers
- My family owns a Hotel and a Restaurant, I grew up working there and for 3 years I ran it with my family
- I work in H14, a family office in Milan, as a frontend developer
- I'm mainly confident in React, JavaScript, TypeScript but I also know other frameworks like Next.js and some backend tools
- I know how to use GitHub, Docker
- I spent the last few months studying and working with AI, so I have a good understanding of OpenAI tools and AI workflows.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { messages } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: messages,
      config: {
        systemInstruction: userContext,
      },
    });

    res.status(200).json({ message: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal error" });
  }
}
