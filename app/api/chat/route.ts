// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  const geminiApiKey = 'AIzaSyD7476rnu8j7VrIQjZvy3xBl6QnqK7Kj8s'; // Add this to your .env.local

  if (!geminiApiKey) {
    return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
  }

  // Convert OpenAI-style messages to Gemini-style prompt
  const userPrompt = messages.map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n") + "\nAssistant:";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD7476rnu8j7VrIQjZvy3xBl6QnqK7Kj8s`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const geminiReply = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ text: geminiReply });
    } else {
      return NextResponse.json({ error: "No response from Gemini" }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gemini API call failed" }, { status: 500 });
  }
}
