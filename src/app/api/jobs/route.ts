import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const location = searchParams.get("location") || ""
  const type = searchParams.get("type") || ""
  const remote = searchParams.get("remote") === "true"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 10

  const where: any = {
    status: "ACTIVE",
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { skills: { has: search } },
      ]
    }),
    ...(location && { location: { contains: location, mode: "insensitive" } }),
    ...(type && { type }),
    ...(remote && { remote: true }),
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: { select: { name: true, logo: true, industry: true, verified: true } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ])

  return NextResponse.json({ jobs, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const company = await prisma.company.findUnique({ where: { userId: session.user.id } })
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 })

    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: body.title,
        description: body.description,
        requirements: body.requirements || [],
        skills: body.skills || [],
        location: body.location,
        type: body.type || "FULL_TIME",
        remote: body.remote || false,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        experience: body.experience || 0,
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}