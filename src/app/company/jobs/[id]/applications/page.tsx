import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import ApplicationsClient from "./ApplicationsClient"

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id }
  })
  if (!company) redirect("/company/setup")

  const job = await prisma.job.findFirst({
    where: { id, companyId: company.id },
    include: {
      applications: {
        include: {
          candidate: {
            include: {
              user: { select: { name: true, image: true, email: true } }
            }
          }
        },
        orderBy: { aiScore: "desc" }
      }
    }
  })

  if (!job) notFound()

  return <ApplicationsClient job={job} />
}