import { chatSession } from "@/configs/AiModel";
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

        const result = await chatSession.sendMessage(prompt);
        const AIResp = result.response.text();
        
        return NextResponse.json({ 
            result: AIResp,
            success: true 
        });
    } catch (error) {
        console.error("AI Chat Error:", error);
        
        return NextResponse.json(
            { 
                error: "Failed to get AI response",
                details: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}