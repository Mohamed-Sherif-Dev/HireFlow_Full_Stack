"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Briefcase, MapPin, DollarSign, Wifi,
  Plus, X, Sparkles, ArrowLeft, CheckCircle
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbare"

const SKILLS_OPTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
  "Python", "Java", "Go", "Vue.js", "Angular", "PostgreSQL",
  "MongoDB", "Redis", "Docker", "AWS", "GraphQL", "Git",
]

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Internship" },
]

export default function PostJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "FULL_TIME",
    remote: false,
    salaryMin: "",
    salaryMax: "",
    experience: "0",
    skills: [] as string[],
    requirements: [] as string[],
  })
  const [newReq, setNewReq] = useState("")

  function toggleSkill(skill: string) {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  function addRequirement() {
    if (!newReq.trim()) return
    setForm(prev => ({ ...prev, requirements: [...prev.requirements, newReq.trim()] }))
    setNewReq("")
  }

  function removeRequirement(i: number) {
    setForm(prev => ({ ...prev, requirements: prev.requirements.filter((_, idx) => idx !== i) }))
  }

  async function generateDescription() {
    if (!form.title.trim()) return
    setGeneratingDesc(true)
    try {
      const res = await fetch("/api/ai/generate-job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, skills: form.skills, type: form.type }),
      })
      const data = await res.json()
      if (data.description) setForm(prev => ({ ...prev, description: data.description }))
    } catch {
      console.error("Failed to generate description")
    } finally {
      setGeneratingDesc(false)
    }
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
          experience: parseInt(form.experience),
        }),
      })
      const job = await res.json()
      router.push(`/company/dashboard`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link
          href="/company/dashboard"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
          <p className="text-slate-400">AI will help candidates find and match with your job</p>
        </motion.div>

        <div className="glass-card rounded-3xl p-8 space-y-6">

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior React Developer"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Description *</label>
              <button
                onClick={generateDescription}
                disabled={!form.title.trim() || generatingDesc}
                className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-40"
              >
                {generatingDesc ? (
                  <div className="w-3.5 h-3.5 border border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {generatingDesc ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm resize-none"
            />
          </div>

          {/* Location + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Location *</label>
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
              <label className="block text-sm font-medium text-slate-400 mb-2">Job Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 text-sm"
              >
                {JOB_TYPES.map(t => (
                  <option key={t.value} value={t.value} className="bg-slate-900">{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary + Experience */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Min Salary (EGP)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                  placeholder="20000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Max Salary (EGP)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                  placeholder="40000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Experience (years)</label>
              <select
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 text-sm"
              >
                {["0", "1", "2", "3", "4", "5", "7", "10"].map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y}+ years</option>
                ))}
              </select>
            </div>
          </div>

          {/* Remote */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm({ ...form, remote: !form.remote })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                form.remote
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Wifi className="w-4 h-4" />
              {form.remote ? "Remote ✓" : "Remote Work"}
            </button>
            <p className="text-xs text-slate-500">Toggle if this job supports remote work</p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">
              Required Skills
              <span className="text-slate-600 ml-1">({form.skills.length} selected)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS_OPTIONS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                    form.skills.includes(skill)
                      ? "bg-brand-500/20 border-brand-500/40 text-brand-400"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Requirements</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newReq}
                onChange={(e) => setNewReq(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRequirement()}
                placeholder="e.g. 3+ years React experience"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
              />
              <button
                onClick={addRequirement}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl text-sm hover:bg-brand-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {form.requirements.length > 0 && (
              <div className="space-y-2">
                {form.requirements.map((req, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/3 border border-white/8 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
                      {req}
                    </div>
                    <button
                      onClick={() => removeRequirement(i)}
                      className="text-slate-600 hover:text-red-400 transition-colors ml-3"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.description.trim() || !form.location.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold py-4 rounded-xl transition-all text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                Post Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}