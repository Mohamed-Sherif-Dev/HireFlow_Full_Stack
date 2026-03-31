import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: session.user.id }
    })

    if (!candidate) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

    // Get all active jobs
    const jobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: { company: { select: { name: true, logo: true, verified: true } } },
      take: 50,
    })

    // Score each job
    const scored = jobs.map(job => {
      const matchedSkills = job.skills.filter(s => candidate.skills.includes(s))
      const skillScore = job.skills.length > 0
        ? (matchedSkills.length / job.skills.length) * 60
        : 30

      const expDiff = Math.abs((candidate.experience || 0) - (job.experience || 0))
      const expScore = expDiff === 0 ? 40 : expDiff === 1 ? 30 : expDiff === 2 ? 20 : 10

      const totalScore = Math.min(Math.round(skillScore + expScore), 100)

      return { ...job, matchScore: totalScore, matchedSkills }
    })

    // Sort by score
    scored.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json(scored.slice(0, 10))
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}