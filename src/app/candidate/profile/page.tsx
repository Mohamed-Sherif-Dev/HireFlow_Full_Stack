import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import CandidateProfileClient from "./CandidateProfileClient"

export default async function CandidateProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const candidate = await prisma.candidate.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, email: true, image: true } },
      applications: {
        select: { id: true, status: true, aiScore: true },
      }
    }
  })

  if (!candidate) redirect("/candidate/setup")

  return <CandidateProfileClient candidate={candidate} session={session} />
}