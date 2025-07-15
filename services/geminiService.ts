import { GoogleGenAI } from "@google/genai";
import { UserAnswers, Product } from '../types';

export const generateComparisonText = async (
    answers: UserAnswers,
    idealProduct: Product,
    strongProduct: Product
): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return `Based on your focus on ${answers.priorities.join(', ')}, ${idealProduct.name} is the ideal choice. It excels in ${idealProduct.keyStrengths.join(', ')}. As a strong alternative, consider ${strongProduct.name}, which offers great capabilities in ${strongProduct.keyStrengths.join(', ')}.`;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let budgetString = 'Not Specified';
    const { min, max } = answers.expectedBudget;
    if (min !== null && max !== null) {
      budgetString = `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min !== null) {
      budgetString = `From $${min.toLocaleString()}`;
    } else if (max !== null) {
      budgetString = `Up to $${max.toLocaleString()}`;
    }

    const prompt = `
        You are an expert marketing assistant for ION Group, a financial software company.
        A potential client has completed a questionnaire. Based on their answers, we've identified two suitable products: an "Ideal Fit" and a "Strong Alternative".

        Your task is to write a short, persuasive, and positive comparison (3-4 sentences).
        1. Start by acknowledging why the "Ideal Fit" is the top recommendation, linking it to the client's most important priorities.
        2. Seamlessly introduce the "Strong Alternative", highlighting its key strengths and explaining why it's also an excellent choice, perhaps based on a different aspect of their answers (e.g., budget, timeline, specific feature).
        3. Frame the choice as a "win-win", empowering the client.
        4. Make it feel personal by referencing their specific answers. Do NOT use markdown or bullet points. Write in a conversational paragraph.
        5. Do NOT repeat the product names in your explanation. Refer to them by their role (e.g., "The ideal solution," "This platform," "The alternative," etc.).

        **Client's Answers:**
        - Industry: ${answers.industry}
        - Organization Size: ${answers.orgSize}
        - Number of Users: ${answers.users}
        - Expected Budget (Annual USD): ${budgetString}
        - Desired Go-Live Timeline: ${answers.goLiveTimeline || 'Not Specified'}
        - Key Priorities: ${answers.priorities.join(', ')}

        **Ideal Fit Product:**
        - Name: ${idealProduct.name}
        - Description: ${idealProduct.description}
        - Key Strengths: ${idealProduct.keyStrengths.join(', ')}

        **Strong Alternative Product:**
        - Name: ${strongProduct.name}
        - Description: ${strongProduct.description}
        - Key Strengths: ${strongProduct.keyStrengths.join(', ')}

        Now, generate the personalized comparison.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating comparison text:", error);
        return `Based on your focus on ${answers.priorities.join(', ')}, the recommended solution is an excellent choice due to its strengths in ${idealProduct.keyStrengths.join(', ')}. As a strong alternative, you could also consider a platform that excels in ${strongProduct.keyStrengths.join(', ')}, giving you another great option to evaluate.`;
    }
};
