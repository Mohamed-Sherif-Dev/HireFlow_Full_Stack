import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import CandidateDashboardClient from "./CandidateDashboardClient"

export default async function CandidateDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const candidate = await prisma.candidate.findUnique({
    where: { userId: session.user.id },
    include: {
      applications: {
        include: {
          job: {
            include: { company: { select: { name: true, logo: true } } }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!candidate) redirect("/candidate/setup")

  const stats = {
    total: candidate.applications.length,
    pending: candidate.applications.filter(a => a.status === "PENDING").length,
    shortlisted: candidate.applications.filter(a => a.status === "SHORTLISTED").length,
    accepted: candidate.applications.filter(a => a.status === "ACCEPTED").length,
    avgScore: candidate.applications.length > 0
      ? Math.round(candidate.applications.reduce((acc, a) => acc + (a.aiScore || 0), 0) / candidate.applications.length)
      : 0,
  }

  return <CandidateDashboardClient candidate={candidate} session={session} stats={stats} />
}