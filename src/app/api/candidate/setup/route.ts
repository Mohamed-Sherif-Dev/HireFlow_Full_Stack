import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await req.formData()
    const data: any = {}

    formData.forEach((value, key) => {
      if (key !== "cv") data[key] = value
    })

    const skills = data.skills ? JSON.parse(data.skills) : []
    let cvUrl, cvPublicId

    // Upload CV to Cloudinary
    const cvFile = formData.get("cv") as File
    if (cvFile) {
      const buffer = Buffer.from(await cvFile.arrayBuffer())
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "hireflow/cvs", resource_type: "raw", format: "pdf" },
          (err, result) => err ? reject(err) : resolve(result)
        ).end(buffer)
      })
      cvUrl = result.secure_url
      cvPublicId = result.public_id
    }

    await prisma.candidate.upsert({
      where: { userId: session.user.id },
      update: {
        title: data.title,
        bio: data.bio,
        location: data.location,
        experience: parseInt(data.experience) || 0,
        education: data.education,
        portfolio: data.portfolio,
        linkedin: data.linkedin,
        github: data.github,
        skills,
        ...(cvUrl && { cvUrl, cvPublicId }),
      },
      create: {
        userId: session.user.id,
        title: data.title,
        bio: data.bio,
        location: data.location,
        experience: parseInt(data.experience) || 0,
        education: data.education,
        portfolio: data.portfolio,
        linkedin: data.linkedin,
        github: data.github,
        skills,
        cvUrl,
        cvPublicId,
      },
    })

    // Update user role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "CANDIDATE" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}