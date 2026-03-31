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
    formData.forEach((value, key) => { if (key !== "logo") data[key] = value })

    let logo, logoPublicId
    const logoFile = formData.get("logo") as File
    if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer())
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "hireflow/logos", transformation: [{ width: 200, height: 200, crop: "fill" }] },
          (err, result) => err ? reject(err) : resolve(result)
        ).end(buffer)
      })
      logo = result.secure_url
      logoPublicId = result.public_id
    }

    await prisma.company.upsert({
      where: { userId: session.user.id },
      update: { ...data, ...(logo && { logo, logoPublicId }) },
      create: { userId: session.user.id, ...data, logo, logoPublicId },
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "COMPANY" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}