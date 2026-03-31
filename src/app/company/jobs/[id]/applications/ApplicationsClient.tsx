"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft, Sparkles, CheckCircle, XCircle,
  Clock, Star, User, Mail, Briefcase,
  MapPin,  FileText,
  ChevronDown, ChevronUp, Filter
} from "lucide-react"
import Navbar from "@/components/Navbare"
import { timeAgo, getInitials } from "@/lib/utils"
import { FaGithub , FaLinkedin } from "react-icons/fa"

const STATUS_CONFIG: Record<string, any> = {
  PENDING: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  REVIEWING: { label: "Reviewing", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  SHORTLISTED: { label: "Shortlisted ⭐", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  REJECTED: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ACCEPTED: { label: "Accepted 🎉", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
}

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return "text-green-400"
  if (score >= 60) return "text-brand-400"
  if (score >= 40) return "text-yellow-400"
  return "text-red-400"
}

const SCORE_RING = (score: number) => {
  if (score >= 80) return "#22c55e"
  if (score >= 60) return "#0ea5e9"
  if (score >= 40) return "#eab308"
  return "#ef4444"
}

export default function ApplicationsClient({ job }: any) {
  const [applications, setApplications] = useState(job.applications)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState("ALL")
  const [updating, setUpdating] = useState<string | null>(null)

  async function updateStatus(appId: string, status: string) {
    setUpdating(appId)
    try {
      await fetch(`/api/applications/${appId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setApplications((prev: any[]) =>
        prev.map(a => a.id === appId ? { ...a, status } : a)
      )
    } catch {
      console.error("Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === "ALL"
    ? applications
    : applications.filter((a: any) => a.status === filter)

  const circumference = 2 * Math.PI * 28

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
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
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
          <p className="text-slate-400 text-sm">
            {applications.length} applications • Sorted by AI Score
          </p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: "All", value: applications.length, key: "ALL" },
            { label: "Pending", value: applications.filter((a: any) => a.status === "PENDING").length, key: "PENDING" },
            { label: "Reviewing", value: applications.filter((a: any) => a.status === "REVIEWING").length, key: "REVIEWING" },
            { label: "Shortlisted", value: applications.filter((a: any) => a.status === "SHORTLISTED").length, key: "SHORTLISTED" },
            { label: "Rejected", value: applications.filter((a: any) => a.status === "REJECTED").length, key: "REJECTED" },
          ].map(stat => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className={`glass-card rounded-xl p-3 text-center transition-all border ${
                filter === stat.key
                  ? "border-brand-500/40 bg-brand-500/10"
                  : "border-white/6 hover:border-white/15"
              }`}
            >
              <p className={`text-xl font-bold ${filter === stat.key ? "text-brand-400" : ""}`}>
                {stat.value}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <User className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No applications in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app: any, i: number) => {
              const status = STATUS_CONFIG[app.status]
              const ringColor = app.aiScore ? SCORE_RING(app.aiScore) : "#475569"
              const offset = app.aiScore
                ? circumference - (app.aiScore / 100) * circumference
                : circumference
              const isExpanded = expanded === app.id

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* App Header */}
                  <div
                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/3 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : app.id)}
                  >
                    {/* Avatar */}
                    <div className="shrink-0">
                      {app.candidate.user.image ? (
                        <img src={app.candidate.user.image} alt="" className="w-12 h-12 rounded-xl border border-white/10" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center font-bold">
                          {getInitials(app.candidate.user.name || "?")}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold">{app.candidate.user.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-lg border ${status.bg} ${status.border} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{app.candidate.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        {app.candidate.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {app.candidate.location}
                          </div>
                        )}
                        {app.candidate.experience > 0 && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {app.candidate.experience}y exp
                          </div>
                        )}
                        <span>{timeAgo(app.createdAt)}</span>
                      </div>
                    </div>

                    {/* AI Score Ring */}
                    <div className="shrink-0 relative">
                      <svg width="64" height="64" className="score-ring">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                        <motion.circle
                          cx="32" cy="32" r="28"
                          fill="none"
                          stroke={ringColor}
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset: offset }}
                          transition={{ duration: 0.8, delay: i * 0.04 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${app.aiScore ? SCORE_COLOR(app.aiScore) : "text-slate-500"}`}>
                          {app.aiScore || "?"}
                        </span>
                      </div>
                    </div>

                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    }
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-white/6"
                      >
                        <div className="p-5 space-y-5">

                          {/* AI Analysis */}
                          {app.aiScore && (
                            <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-brand-400" />
                                <span className="font-semibold text-sm text-brand-400">AI Analysis</span>
                                <span className={`ml-auto text-lg font-bold ${SCORE_COLOR(app.aiScore)}`}>
                                  {app.aiScore}% Match
                                </span>
                              </div>
                              {app.aiReasoning && (
                                <p className="text-slate-400 text-sm mb-3 leading-relaxed">{app.aiReasoning}</p>
                              )}
                              <div className="grid grid-cols-2 gap-3">
                                {app.aiStrengths?.length > 0 && (
                                  <div className="bg-green-500/5 border border-green-500/15 rounded-lg p-3">
                                    <p className="text-green-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      Strengths
                                    </p>
                                    <ul className="space-y-1">
                                      {app.aiStrengths.map((s: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-400 flex items-start gap-1">
                                          <span className="text-green-400">•</span> {s}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {app.aiWeaknesses?.length > 0 && (
                                  <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3">
                                    <p className="text-red-400 text-xs font-semibold mb-2 flex items-center gap-1">
                                      <XCircle className="w-3.5 h-3.5" />
                                      Gaps
                                    </p>
                                    <ul className="space-y-1">
                                      {app.aiWeaknesses.map((w: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-400 flex items-start gap-1">
                                          <span className="text-red-400">•</span> {w}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {app.candidate.skills?.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {app.candidate.skills.map((skill: string) => (
                                  <span key={skill} className={`px-2.5 py-1 rounded-lg text-xs border ${
                                    job.skills?.includes(skill)
                                      ? "bg-brand-500/15 border-brand-500/30 text-brand-400"
                                      : "bg-white/5 border-white/8 text-slate-400"
                                  }`}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cover Letter */}
                          {app.coverLetter && (
                            <div>
                              <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Cover Letter</p>
                              <p className="text-sm text-slate-300 leading-relaxed bg-white/3 border border-white/6 rounded-xl p-4">
                                {app.coverLetter}
                              </p>
                            </div>
                          )}

                          {/* Links + Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-2">
                              {app.candidate.user.email && (
                                <a href={`mailto:${app.candidate.user.email}`}
                                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg transition-colors">
                                  <Mail className="w-3.5 h-3.5" />
                                  Email
                                </a>
                              )}
                              {app.candidate.github && (
                                <a href={app.candidate.github} target="_blank"
                                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg transition-colors">
                                  <FaGithub className="w-3.5 h-3.5" />
                                  GitHub
                                </a>
                              )}
                              {app.candidate.linkedin && (
                                <a href={app.candidate.linkedin} target="_blank"
                                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg transition-colors">
                                  <FaLinkedin className="w-3.5 h-3.5" />
                                  LinkedIn
                                </a>
                              )}
                              {app.candidate.cvUrl && (
                                <a href={app.candidate.cvUrl} target="_blank"
                                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg transition-colors">
                                  <FileText className="w-3.5 h-3.5" />
                                  CV
                                </a>
                              )}
                            </div>

                            {/* Status Actions */}
                            <div className="flex gap-2">
                              {["SHORTLISTED", "REJECTED", "ACCEPTED"].map(s => (
                                app.status !== s && (
                                  <button
                                    key={s}
                                    onClick={() => updateStatus(app.id, s)}
                                    disabled={updating === app.id}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                                      s === "SHORTLISTED"
                                        ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                                        : s === "ACCEPTED"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                        : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                                    }`}
                                  >
                                    {s === "SHORTLISTED" ? <Star className="w-3.5 h-3.5" /> :
                                     s === "ACCEPTED" ? <CheckCircle className="w-3.5 h-3.5" /> :
                                     <XCircle className="w-3.5 h-3.5" />}
                                    {s === "SHORTLISTED" ? "Shortlist" :
                                     s === "ACCEPTED" ? "Accept" : "Reject"}
                                  </button>
                                )
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}