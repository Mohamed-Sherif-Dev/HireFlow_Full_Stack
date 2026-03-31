import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await req.json()

  try {
    const [candidate, job] = await Promise.all([
      prisma.candidate.findUnique({ where: { userId: session.user.id } }),
      prisma.job.findUnique({
        where: { id: jobId },
        include: { company: { select: { name: true } } }
      })
    ])

    if (!candidate || !job) return NextResponse.json({ error: "Not found" }, { status: 404 })

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
            content: "You are an expert cover letter writer. Write compelling, personalized cover letters. Return ONLY the cover letter text, no extra explanation."
          },
          {
            role: "user",
            content: `Write a professional cover letter for:

Job: ${job.title} at ${job.company.name}
Requirements: ${job.skills.join(", ")}
Description: ${job.description.slice(0, 400)}

Candidate:
Name: ${session.user.name}
Title: ${candidate.title}
Skills: ${candidate.skills.join(", ")}
Experience: ${candidate.experience} years
Bio: ${candidate.bio || ""}

Write a 3-paragraph cover letter that highlights relevant skills and enthusiasm.`
          }
        ]
      })
    })

    const data = await response.json()
    const coverLetter = data.choices?.[0]?.message?.content || ""

    return NextResponse.json({ coverLetter })
  } catch {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 })
  }
}