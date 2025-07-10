
import { GoogleGenAI } from "@google/genai";
import { UserAnswers, Product } from '../types';

export const generateRecommendationText = async (
    answers: UserAnswers,
    product: Product
): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        // Fallback for when API key is not available
        return `Based on your focus on ${answers.priorities.join(', ')} and your organization's scale, ${product.name} is an excellent choice. Its capabilities in ${product.keyStrengths.join(', ')} align perfectly with your requirements.`;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are an expert marketing assistant for ION Group, a financial software company.
        A potential client has just completed a questionnaire about their business needs.
        Based on their answers, we have pre-selected "${product.name}" as the most suitable CTRM solution for them.

        Your task is to write a short, persuasive, and personalized explanation (2-3 sentences) for WHY this product is a great fit for them.
        Directly reference some of their specific answers to make the recommendation feel tailored.
        Do not repeat the product name in your explanation.

        **Client's Answers:**
        - Industry: ${answers.industry}
        - Organization Size: ${answers.orgSize}
        - Number of Users: ${answers.users}
        - Trading Type: ${answers.tradingType}
        - Key Priorities: ${answers.priorities.join(', ')}
        - Primary Region: ${answers.region}

        **Recommended Product Information:**
        - Name: ${product.name}
        - Description: ${product.description}
        - Key Strengths: ${product.keyStrengths.join(', ')}

        Now, generate the personalized explanation.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating recommendation text:", error);
        // Provide a fallback message on error
        return `Based on your focus on ${answers.priorities.join(', ')} and your organization's scale of '${answers.orgSize}', this platform is an excellent choice. Its core strengths in ${product.keyStrengths.join(', ')} align perfectly with your stated requirements.`;
    }
};
