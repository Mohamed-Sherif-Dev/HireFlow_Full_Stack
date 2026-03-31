import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { title, skills, type } = await req.json()

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-70b-instruct",
      messages: [
        {
          role: "system",
          content: "You are an expert HR writer. Write compelling job descriptions. Return ONLY the job description text, no extra explanation, no markdown headers."
        },
        {
          role: "user",
          content: `Write a professional job description for:
Title: ${title}
Type: ${type}
Required Skills: ${skills?.join(", ") || "Not specified"}

Write 3-4 paragraphs covering: role overview, responsibilities, what we offer, and ideal candidate profile.`
        }
      ]
    })
  })

  const data = await response.json()
  const description = data.choices?.[0]?.message?.content || ""
  return NextResponse.json({ description })
}