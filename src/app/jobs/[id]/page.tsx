import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import JobDetailsClient from "./JobDetailsClient"

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  const [job, candidate] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
    }),
    session?.user?.id
      ? prisma.candidate.findUnique({
          where: { userId: session.user.id },
          include: {
            applications: { where: { jobId: id }, select: { id: true, status: true, aiScore: true } }
          }
        })
      : null,
  ])

  if (!job) notFound()

  // Increment views
  await prisma.job.update({ where: { id }, data: { views: { increment: 1 } } })

  return <JobDetailsClient job={job} candidate={candidate} session={session} />
}