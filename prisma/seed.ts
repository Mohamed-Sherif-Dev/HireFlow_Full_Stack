import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const user = await prisma.user.create({
    data: {
      name: "Tech Corp",
      email: "company@test.com",
      role: "COMPANY",
    }
  })

  // Create company
  const company = await prisma.company.create({
    data: {
      userId: user.id,
      name: "Tech Corp",
      industry: "Software",
      location: "Cairo, Egypt",
      size: "50-200",
      description: "Leading software company in Egypt",
      verified: true,
    }
  })

  // Create jobs
  const jobs = [
    {
      title: "Senior React Developer",
      description: "We are looking for an experienced React developer to join our team. You will be building scalable web applications using React, TypeScript, and Next.js.",
      requirements: ["3+ years React experience", "TypeScript proficiency", "REST API integration"],
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
      location: "Cairo, Egypt",
      type: "FULL_TIME" as const,
      remote: true,
      salaryMin: 30000,
      salaryMax: 50000,
      experience: 3,
      featured: true,
    },
    {
      title: "Full Stack Developer",
      description: "Join our growing team as a Full Stack Developer. You will work on both frontend and backend systems using modern technologies.",
      requirements: ["2+ years experience", "Node.js knowledge", "Database design"],
      skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
      location: "Alexandria, Egypt",
      type: "FULL_TIME" as const,
      remote: false,
      salaryMin: 25000,
      salaryMax: 40000,
      experience: 2,
      featured: false,
    },
    {
      title: "Frontend Developer",
      description: "We need a talented Frontend Developer who is passionate about creating beautiful user interfaces.",
      requirements: ["1+ years experience", "Strong CSS skills", "React knowledge"],
      skills: ["React", "JavaScript", "CSS", "Tailwind CSS", "Figma"],
      location: "Remote",
      type: "FULL_TIME" as const,
      remote: true,
      salaryMin: 20000,
      salaryMax: 35000,
      experience: 1,
      featured: false,
    },
    {
      title: "Backend Node.js Developer",
      description: "Looking for a skilled Backend Developer to build and maintain our APIs and microservices.",
      requirements: ["2+ years Node.js", "REST API design", "Database experience"],
      skills: ["Node.js", "Express.js", "MongoDB", "Redis", "Docker"],
      location: "Cairo, Egypt",
      type: "CONTRACT" as const,
      remote: true,
      salaryMin: 20000,
      salaryMax: 30000,
      experience: 2,
      featured: false,
    },
    {
      title: "React Native Developer",
      description: "Build amazing mobile applications using React Native for both iOS and Android platforms.",
      requirements: ["2+ years mobile development", "React Native experience", "API integration"],
      skills: ["React Native", "TypeScript", "JavaScript", "REST API", "Git"],
      location: "Remote",
      type: "FREELANCE" as const,
      remote: true,
      salaryMin: 15000,
      salaryMax: 25000,
      experience: 2,
      featured: false,
    },
  ]

  for (const job of jobs) {
    await prisma.job.create({
      data: { ...job, companyId: company.id }
    })
  }

  console.log("✅ Seed data created!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())