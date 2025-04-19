import OpenAI from "openai";
import { WebsiteGenerationResult } from "../client/src/lib/ai-service";

// Initialize OpenAI with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a website based on a text prompt using OpenAI
 */
export async function generateWebsiteWithAI(prompt: string): Promise<WebsiteGenerationResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert web developer who specializes in creating clean, responsive HTML, CSS, and JavaScript code. 
                   Your task is to generate code for a website based on the user's prompt. 
                   The website should be modern, responsive, and follow best practices. 
                   Return only the code without any explanations or markdown formatting.
                   Structure your response as JSON with these keys:
                   html: (the complete HTML code)
                   css: (the complete CSS code)
                   js: (the complete JavaScript code)`
        },
        {
          role: "user",
          content: `Create a website for: ${prompt}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const result = JSON.parse(content);
    
    return {
      html: result.html || "",
      css: result.css || "",
      js: result.js || "",
      preview: "" // Preview URL would be generated elsewhere
    };
  } catch (error) {
    console.error("Error generating website with OpenAI:", error);
    throw new Error("Failed to generate website. Please try again later.");
  }
}

/**
 * Analyzes a Canva design image and generates website code using OpenAI Vision
 */
export async function analyzeCanvaDesignWithAI(imageData: string): Promise<WebsiteGenerationResult> {
  try {
    // Remove data URL prefix if present
    const base64Image = imageData.includes("base64,") 
      ? imageData.split("base64,")[1] 
      : imageData;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert web developer and designer. Your task is to analyze the provided design image 
                   and create HTML, CSS, and JavaScript code that recreates this design as a functional website.
                   The website should be modern, responsive, and follow best practices.
                   Return only the code without any explanations or markdown formatting.
                   Structure your response as JSON with these keys:
                   html: (the complete HTML code)
                   css: (the complete CSS code)
                   js: (the complete JavaScript code)`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this Canva design and create a website that matches this design. Generate the HTML, CSS, and JavaScript code."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const result = JSON.parse(content);
    
    return {
      html: result.html || "",
      css: result.css || "",
      js: result.js || "",
      preview: "" // Preview URL would be generated elsewhere
    };
  } catch (error) {
    console.error("Error analyzing design with OpenAI:", error);
    throw new Error("Failed to analyze design. Please try again later.");
  }
}