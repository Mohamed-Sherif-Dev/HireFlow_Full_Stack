import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: jobId } = await params
  const { coverLetter } = await req.json()

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: session.user.id }
    })
    if (!candidate) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

    const existing = await prisma.application.findUnique({
      where: { jobId_candidateId: { jobId, candidateId: candidate.id } }
    })
    if (existing) return NextResponse.json({ error: "Already applied" }, { status: 400 })

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

    // AI Scoring
    const aiResult = await scoreCandidate(candidate, job)

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: candidate.id,
        coverLetter,
        aiScore: aiResult.score,
        aiReasoning: aiResult.reasoning,
        aiStrengths: aiResult.strengths,
        aiWeaknesses: aiResult.weaknesses,
      }
    })

    // Increment views
    await prisma.job.update({
      where: { id: jobId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 })
  }
}

async function scoreCandidate(candidate: any, job: any) {
  try {
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
            content: `You are an expert recruitment AI. Score how well a candidate fits a job.

Return ONLY valid JSON:
{
  "score": number (0-100),
  "reasoning": "2-3 sentence explanation",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["gap1", "gap2"]
}

Return ONLY the JSON, no extra text.`
          },
          {
            role: "user",
            content: `Job: ${job.title}
Required Skills: ${job.skills.join(", ")}
Experience Required: ${job.experience} years
Description: ${job.description.slice(0, 500)}

Candidate:
Title: ${candidate.title}
Skills: ${candidate.skills.join(", ")}
Experience: ${candidate.experience} years
Education: ${candidate.education || "Not specified"}`
          }
        ]
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || "{}"
    const clean = content.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
  } catch {
    return { score: 50, reasoning: "AI scoring unavailable", strengths: [], weaknesses: [] }
  }
}