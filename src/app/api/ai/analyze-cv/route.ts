import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("cv") as File

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const text = await file.text()

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: `You are an expert CV analyzer. Extract structured information from CVs.

Return ONLY a valid JSON object:
{
  "title": "Job title/role",
  "bio": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": number (years),
  "education": "Degree, University"
}

Return ONLY the JSON, no extra text.`
          },
          {
            role: "user",
            content: `Analyze this CV:\n\n${text.slice(0, 3000)}`
          }
        ]
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || "{}"
    const clean = content.replace(/```json|```/g, "").trim()
    const profile = JSON.parse(clean)

    return NextResponse.json({ profile })
  } catch {
    return NextResponse.json({ profile: null })
  }
}