"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft, MapPin, Briefcase, Clock, DollarSign,
  Wifi, Star, Building2, Users, Eye, Sparkles,
  CheckCircle, XCircle, Send, Copy, Check,
  ExternalLink, Globe, AlertCircle
} from "lucide-react"
import { formatSalary, timeAgo, cn } from "@/lib/utils"
import Navbar from "@/components/Navbare"

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
}

const SCORE_CONFIG = (score: number) => {
  if (score >= 80) return { label: "Excellent Match", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", ring: "#22c55e" }
  if (score >= 60) return { label: "Good Match", color: "text-brand-400", bg: "bg-brand-500/10", border: "border-brand-500/20", ring: "#0ea5e9" }
  if (score >= 40) return { label: "Fair Match", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", ring: "#eab308" }
  return { label: "Low Match", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", ring: "#ef4444" }
}

export default function JobDetailsClient({ job, candidate, session }: any) {
  const [applying, setApplying] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [generatingCL, setGeneratingCL] = useState(false)
  const [copied, setCopied] = useState(false)
  const [applied, setApplied] = useState(!!candidate?.applications?.[0])
  const [appResult, setAppResult] = useState(candidate?.applications?.[0] || null)

  const hasApplied = applied || !!candidate?.applications?.[0]
  const application = appResult || candidate?.applications?.[0]

  async function generateCoverLetter() {
    setGeneratingCL(true)
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      })
      const data = await res.json()
      setCoverLetter(data.coverLetter)
    } catch {
      console.error("Failed to generate cover letter")
    } finally {
      setGeneratingCL(false)
    }
  }

  async function handleApply() {
    setApplying(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      })
      const data = await res.json()
      setAppResult(data)
      setApplied(true)
      setShowApplyModal(false)
    } catch {
      console.error("Failed to apply")
    } finally {
      setApplying(false)
    }
  }

  const scoreConfig = application?.aiScore ? SCORE_CONFIG(application.aiScore) : null
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = application?.aiScore
    ? circumference - (application.aiScore / 100) * circumference
    : circumference

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link
          href="/jobs"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {job.company.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-7 h-7 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h1 className="text-2xl font-bold">{job.title}</h1>
                        {job.featured && (
                          <span className="flex items-center gap-1 text-xs bg-yellow-500/15 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-400 font-medium">{job.company.name}</p>
                        {job.company.verified && (
                          <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 mb-5">
                {[
                  { icon: MapPin, text: job.location },
                  { icon: Briefcase, text: TYPE_LABELS[job.type] },
                  { icon: Clock, text: timeAgo(job.createdAt) },
                  ...(job.remote ? [{ icon: Wifi, text: "Remote", green: true }] : []),
                  ...((job.salaryMin || job.salaryMax) ? [{ icon: DollarSign, text: formatSalary(job.salaryMin, job.salaryMax) }] : []),
                  { icon: Users, text: `${job._count.applications} applicants` },
                  { icon: Eye, text: `${job.views} views` },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-1.5 text-sm ${(item as any).green ? "text-green-400" : "text-slate-400"}`}>
                    <item.icon className="w-4 h-4" />
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="font-bold text-lg mb-4">Job Description</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                {job.description}
              </p>
            </motion.div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="font-bold text-lg mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* AI Score Result */}
            {hasApplied && application && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-2xl p-6 border ${scoreConfig?.border}`}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  <h2 className="font-bold text-lg">AI Match Analysis</h2>
                </div>

                <div className="flex items-center gap-6 mb-5">
                  {/* Score Ring */}
                  <div className="relative shrink-0">
                    <svg width="100" height="100" className="score-ring">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke={scoreConfig?.ring}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${scoreConfig?.color}`}>
                        {application.aiScore}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className={`text-lg font-bold ${scoreConfig?.color} mb-1`}>
                      {scoreConfig?.label}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {application.aiReasoning}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.aiStrengths?.length > 0 && (
                    <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4">
                      <p className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        Strengths
                      </p>
                      <ul className="space-y-1">
                        {application.aiStrengths.map((s: string, i: number) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                            <span className="text-green-400 mt-0.5">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {application.aiWeaknesses?.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                      <p className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Areas to Improve
                      </p>
                      <ul className="space-y-1">
                        {application.aiWeaknesses.map((w: string, i: number) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                            <span className="text-red-400 mt-0.5">•</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-5 sticky top-20"
            >
              {hasApplied ? (
                <div className="text-center py-2">
                  <div className="w-14 h-14 bg-green-500/15 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  </div>
                  <p className="font-bold text-green-400 mb-1">Application Submitted!</p>
                  <p className="text-slate-500 text-xs mb-4">
                    AI Score: <span className={`font-bold ${scoreConfig?.color}`}>{application?.aiScore}/100</span>
                  </p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                    application?.status === "PENDING" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                    application?.status === "SHORTLISTED" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    application?.status === "REJECTED" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                    "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  }`}>
                    {application?.status || "PENDING"}
                  </div>
                </div>
              ) : !session ? (
                <div className="text-center">
                  <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm mb-4">Sign in to apply for this job</p>
                  <Link
                    href="/auth/signin"
                    className="block w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-all text-sm text-center"
                  >
                    Sign In to Apply
                  </Link>
                </div>
              ) : !candidate ? (
                <div className="text-center">
                  <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm mb-4">Complete your profile to apply</p>
                  <Link
                    href="/candidate/setup"
                    className="block w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-all text-sm text-center"
                  >
                    Complete Profile
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="font-bold mb-4">Apply for this position</h3>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg hover:shadow-brand-500/20"
                  >
                    <Send className="w-4 h-4" />
                    Apply Now
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-3">
                    AI will score your application automatically
                  </p>
                </>
              )}
            </motion.div>

            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-5"
            >
              <h3 className="font-bold mb-4">About Company</h3>
              <div className="space-y-2.5">
                {[
                  { icon: Building2, text: job.company.industry || "Technology" },
                  { icon: Users, text: job.company.size || "N/A" + " employees" },
                  { icon: MapPin, text: job.company.location || job.location },
                  ...(job.company.website ? [{ icon: Globe, text: job.company.website, link: true }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <item.icon className="w-4 h-4 shrink-0" />
                    {(item as any).link ? (
                      <a href={item.text} target="_blank" className="text-brand-400 hover:underline flex items-center gap-1">
                        {item.text}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </div>
                ))}
              </div>
              {job.company.description && (
                <p className="text-slate-500 text-xs mt-4 leading-relaxed">
                  {job.company.description}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowApplyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="glass-card rounded-3xl p-6 w-full max-w-2xl border border-white/8"
            >
              <h2 className="text-xl font-bold mb-1">Apply for {job.title}</h2>
              <p className="text-slate-400 text-sm mb-5">{job.company.name}</p>

              {/* Cover Letter */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">
                    Cover Letter <span className="text-slate-600">(optional)</span>
                  </label>
                  <button
                    onClick={generateCoverLetter}
                    disabled={generatingCL}
                    className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-50"
                  >
                    {generatingCL ? (
                      <div className="w-3.5 h-3.5 border border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {generatingCL ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter or use AI to generate one..."
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 resize-none text-sm"
                />
              </div>

              {/* Note */}
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 mb-5 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-400">
                  AI will automatically score your application (0-100%) based on your profile and job requirements.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 glass rounded-xl text-sm text-slate-400 hover:text-white transition-colors border border-white/8"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all text-sm"
                >
                  {applying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}