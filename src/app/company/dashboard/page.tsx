import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import CompanyDashboardClient from "./CompanyDashboardClient"

export default async function CompanyDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    include: {
      jobs: {
        include: {
          _count: { select: { applications: true } },
          applications: {
            include: {
              candidate: {
                include: { user: { select: { name: true, image: true } } }
              }
            },
            orderBy: { aiScore: "desc" },
            take: 3,
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!company) redirect("/company/setup")

  const totalApplications = company.jobs.reduce((acc, j) => acc + j._count.applications, 0)
  const activeJobs = company.jobs.filter(j => j.status === "ACTIVE").length
  const totalViews = company.jobs.reduce((acc, j) => acc + j.views, 0)

  return (
    <CompanyDashboardClient
      company={company}
      session={session}
      stats={{ totalApplications, activeJobs, totalViews, totalJobs: company.jobs.length }}
    />
  )
}