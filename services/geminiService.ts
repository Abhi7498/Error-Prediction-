
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        errorType: {
            type: Type.STRING,
            description: "A concise classification of the error category (e.g., 'Database Connectivity', 'Invalid Parameter', 'Service Timeout')."
        },
        rootCause: {
            type: Type.STRING,
            description: "A detailed but clear explanation of the most likely root cause of the error."
        },
        impact: {
            type: Type.STRING,
            description: "A brief analysis of the potential impact on the system or users."
        },
        suggestion: {
            type: Type.OBJECT,
            properties: {
                description: {
                    type: Type.STRING,
                    description: "A clear, actionable step-by-step fix suggestion."
                },
                actionLabel: {
                    type: Type.STRING,
                    description: "A short label for the action button (e.g., 'Retry with Backup Credentials', 'Clear Cache')."
                },
                command: {
                    type: Type.STRING,
                    description: "An optional example shell command to execute the fix."
                }
            },
            required: ["description", "actionLabel"]
        }
    },
    required: ["errorType", "rootCause", "impact", "suggestion"]
};


export async function analyzeError(errorMessage: string): Promise<AIAnalysis> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following system log error and provide a root cause analysis and a concrete, actionable solution: "${errorMessage}"`,
            config: {
                systemInstruction: "You are an expert Site Reliability Engineer named Aegis. Your task is to analyze system log errors, identify the root cause, predict potential impacts, and suggest a concrete, actionable solution. Present your analysis in the specified JSON format. For suggestions, if a database connection fails, suggest retrying with backup credentials or checking firewall rules. If a parameter is null, suggest checking the calling service's payload. If a timeout occurs, suggest increasing the timeout configuration or checking the downstream service's health.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        return parsedJson as AIAnalysis;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to analyze error with Gemini API.");
    }
}
