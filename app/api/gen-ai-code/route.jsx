import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const result = await GenAiCode.sendMessage(prompt);
        const resp = result.response.text();
        
        // Clean the response to ensure it's valid JSON
        let cleanedResp = resp.trim();
        
        // Remove any markdown code block markers
        if (cleanedResp.startsWith('```json')) {
            cleanedResp = cleanedResp.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResp.startsWith('```')) {
            cleanedResp = cleanedResp.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        const parsedResponse = JSON.parse(cleanedResp);
        
        return NextResponse.json({
            ...parsedResponse,
            success: true
        });
        
    } catch (error) {
        console.error("Code Generation Error:", error);
        
        return NextResponse.json(
            { 
                error: "Failed to generate code",
                details: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}