"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  User, MapPin, Briefcase, Upload, Sparkles,
  ArrowRight, ArrowLeft, CheckCircle, Brain
} from "lucide-react"

const SKILLS_OPTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
  "Python", "Java", "Go", "Rust", "Vue.js", "Angular",
  "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS",
  "GraphQL", "REST API", "Git", "CI/CD", "Figma",
  "Tailwind CSS", "Express.js", "FastAPI", "Spring Boot",
]

export default function CandidateSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    bio: "",
    location: "",
    experience: "0",
    education: "",
    portfolio: "",
    linkedin: "",
    github: "",
    skills: [] as string[],
  })

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvPreview, setCvPreview] = useState("")

  function toggleSkill(skill: string) {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  async function analyzeCV(file: File) {
    setAiLoading(true)
    try {
      const formData = new FormData()
      formData.append("cv", file)
      const res = await fetch("/api/ai/analyze-cv", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.profile) {
        setForm(prev => ({
          ...prev,
          title: data.profile.title || prev.title,
          bio: data.profile.bio || prev.bio,
          skills: data.profile.skills || prev.skills,
          experience: data.profile.experience?.toString() || prev.experience,
          education: data.profile.education || prev.education,
        }))
      }
    } catch {
      console.error("CV analysis failed")
    } finally {
      setAiLoading(false)
    }
  }

  async function handleCVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCvFile(file)
    setCvPreview(file.name)
    await analyzeCV(file)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) formData.append(k, JSON.stringify(v))
        else formData.append(k, v)
      })
      if (cvFile) formData.append("cv", cvFile)

      await fetch("/api/candidate/setup", { method: "POST", body: formData })
      router.push("/candidate/dashboard")
    } catch {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Skills", icon: Brain },
    { id: 3, title: "CV Upload", icon: Upload },
  ]

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/6 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set up your profile</h1>
          <p className="text-slate-400">Let AI help you land your dream job</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                step === s.id
                  ? "bg-brand-500/20 border border-brand-500/30 text-brand-400"
                  : step > s.id
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-white/5 border border-white/10 text-slate-500"
              }`}>
                {step > s.id
                  ? <CheckCircle className="w-4 h-4" />
                  : <s.icon className="w-4 h-4" />
                }
                <span className="text-sm font-medium hidden md:block">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px ${step > s.id ? "bg-green-500/50" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8">
          <AnimatePresence mode="wait">

            {/* Step 1 — Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-5">Basic Information</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell companies about yourself..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="Cairo, Egypt"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Experience (years)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <select
                        value={form.experience}
                        onChange={(e) => setForm({ ...form, experience: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500/50 text-sm"
                      >
                        {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map(y => (
                          <option key={y} value={y} className="bg-slate-900">{y} {y === "10+" ? "" : y === "1" ? "year" : "years"}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Education</label>
                  <input
                    type="text"
                    value={form.education}
                    onChange={(e) => setForm({ ...form, education: e.target.value })}
                    placeholder="e.g. Computer Science, Cairo University"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">LinkedIn</label>
                    <input
                      type="text"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">GitHub</label>
                    <input
                      type="text"
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                      placeholder="github.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Skills */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold mb-2">Your Skills</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Select all that apply — AI uses this to match you with jobs
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {SKILLS_OPTIONS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                        form.skills.includes(skill)
                          ? "bg-brand-500/20 border-brand-500/40 text-brand-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-500">
                  {form.skills.length} skills selected
                </p>
              </motion.div>
            )}

            {/* Step 3 — CV Upload */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold mb-2">Upload Your CV</h2>
                <p className="text-slate-400 text-sm mb-6">
                  AI will analyze your CV and auto-complete your profile
                </p>

                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  cvFile
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-white/15 bg-white/3 hover:border-brand-500/40 hover:bg-brand-500/5"
                }`}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCVUpload}
                    className="hidden"
                  />

                  {aiLoading ? (
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-brand-400 font-semibold text-sm">AI is analyzing your CV...</p>
                      <p className="text-slate-500 text-xs mt-1">Extracting skills, experience & more</p>
                    </div>
                  ) : cvFile ? (
                    <div className="text-center">
                      <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                      <p className="text-green-400 font-semibold text-sm">{cvPreview}</p>
                      <p className="text-slate-500 text-xs mt-1">CV uploaded & analyzed successfully!</p>
                      <div className="flex items-center gap-1.5 mt-2 justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-xs text-brand-400">Profile auto-filled by AI</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-300 font-semibold text-sm">Drop your CV here</p>
                      <p className="text-slate-500 text-xs mt-1">PDF format • AI will analyze it automatically</p>
                    </div>
                  )}
                </label>

                {cvFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-brand-500/10 border border-brand-500/20 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-brand-400" />
                      <span className="text-sm font-semibold text-brand-400">AI Analysis Complete</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Your profile has been auto-filled with information extracted from your CV.
                      Review and edit the details in the previous steps if needed.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-slate-400 hover:text-white transition-colors text-sm border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !form.title.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all text-sm"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}