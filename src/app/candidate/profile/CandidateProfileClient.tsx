"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  MapPin, Briefcase, GraduationCap, Globe,
   FileText, Edit,
  CheckCircle, Star, TrendingUp, Eye,
  ArrowLeft, Sparkles
} from "lucide-react"
import Navbar from "@/components/Navbare" 
import { getInitials } from "@/lib/utils"
import { FaLinkedin , FaGithub } from "react-icons/fa"

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return "text-green-400"
  if (score >= 60) return "text-brand-400"
  if (score >= 40) return "text-yellow-400"
  return "text-red-400"
}

export default function CandidateProfileClient({ candidate, session }: any) {
  const avgScore = candidate.applications.length > 0
    ? Math.round(candidate.applications.reduce((acc: number, a: any) => acc + (a.aiScore || 0), 0) / candidate.applications.length)
    : 0

  const acceptedCount = candidate.applications.filter((a: any) => a.status === "ACCEPTED").length
  const shortlistedCount = candidate.applications.filter((a: any) => a.status === "SHORTLISTED").length

  // Profile completeness
  const fields = [candidate.title, candidate.bio, candidate.location, candidate.cvUrl, candidate.skills?.length > 0, candidate.education, candidate.github, candidate.linkedin]
  const completed = fields.filter(Boolean).length
  const completeness = Math.round((completed / fields.length) * 100)

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        <Link
          href="/candidate/dashboard"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Profile Card */}
          <div className="space-y-4">

            {/* Main Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5">
                {candidate.user.image ? (
                  <img
                    src={candidate.user.image}
                    alt=""
                    className="w-24 h-24 rounded-2xl border-2 border-white/10 mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4">
                    {getInitials(candidate.user.name || "U")}
                  </div>
                )}
                <h1 className="text-xl font-bold">{candidate.user.name}</h1>
                <p className="text-brand-400 font-medium text-sm mt-0.5">{candidate.title || "Add your title"}</p>
                {candidate.location && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {candidate.location}
                  </div>
                )}
              </div>

              {/* Profile Completeness */}
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Profile Complete</span>
                  <span className={completeness === 100 ? "text-green-400" : "text-brand-400"}>
                    {completeness}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                {completeness < 100 && (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Complete your profile to get better matches
                  </p>
                )}
              </div>

              {/* Bio */}
              {candidate.bio && (
                <p className="text-slate-400 text-sm leading-relaxed mb-5 text-center">
                  {candidate.bio}
                </p>
              )}

              {/* Info */}
              <div className="space-y-2.5 mb-5">
                {candidate.experience > 0 && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-400">
                    <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                    {candidate.experience} years experience
                  </div>
                )}
                {candidate.education && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-400">
                    <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                    {candidate.education}
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm">
                  <Eye className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className={candidate.available ? "text-green-400" : "text-slate-400"}>
                    {candidate.available ? "Open to work" : "Not available"}
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2">
                {candidate.github && (
                  <a href={candidate.github} target="_blank"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 bg-white/5 border border-white/8 rounded-xl">
                    <FaGithub className="w-4 h-4" />
                    GitHub Profile
                  </a>
                )}
                {candidate.linkedin && (
                  <a href={candidate.linkedin} target="_blank"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 bg-white/5 border border-white/8 rounded-xl">
                    <FaLinkedin className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                )}
                {candidate.portfolio && (
                  <a href={candidate.portfolio} target="_blank"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 bg-white/5 border border-white/8 rounded-xl">
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
                {candidate.cvUrl && (
                  <a href={candidate.cvUrl} target="_blank"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 bg-white/5 border border-white/8 rounded-xl">
                    <FileText className="w-4 h-4" />
                    Download CV
                  </a>
                )}
              </div>

              {/* Edit Button */}
              <Link
                href="/candidate/setup"
                className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white hover:border-brand-500/30 transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-5"
            >
              <h3 className="font-bold mb-4">Application Stats</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Applications", value: candidate.applications.length, icon: Briefcase, color: "text-brand-400" },
                  { label: "Avg AI Score", value: `${avgScore}%`, icon: Sparkles, color: "text-purple-400" },
                  { label: "Shortlisted", value: shortlistedCount, icon: Star, color: "text-yellow-400" },
                  { label: "Accepted", value: acceptedCount, icon: CheckCircle, color: "text-green-400" },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      {stat.label}
                    </div>
                    <span className={`font-bold text-sm ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Skills + Applications */}
          <div className="lg:col-span-2 space-y-5">

            {/* Skills */}
            {candidate.skills?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Skills</h2>
                  <span className="text-xs text-slate-500">{candidate.skills.length} skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl text-sm font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Application Performance</h2>
                <Link href="/candidate/dashboard" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  View All →
                </Link>
              </div>

              {candidate.applications.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No applications yet</p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 mt-4 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Score Distribution */}
                  <div className="bg-white/3 border border-white/6 rounded-xl p-4 mb-4">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-3">AI Score Distribution</p>
                    <div className="flex items-end gap-2 h-16">
                      {[
                        { range: "0-39", count: candidate.applications.filter((a: any) => (a.aiScore || 0) < 40).length, color: "bg-red-400" },
                        { range: "40-59", count: candidate.applications.filter((a: any) => (a.aiScore || 0) >= 40 && (a.aiScore || 0) < 60).length, color: "bg-yellow-400" },
                        { range: "60-79", count: candidate.applications.filter((a: any) => (a.aiScore || 0) >= 60 && (a.aiScore || 0) < 80).length, color: "bg-brand-400" },
                        { range: "80-100", count: candidate.applications.filter((a: any) => (a.aiScore || 0) >= 80).length, color: "bg-green-400" },
                      ].map(bar => {
                        const max = candidate.applications.length
                        const height = max > 0 ? (bar.count / max) * 100 : 0
                        return (
                          <div key={bar.range} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex items-end justify-center" style={{ height: "48px" }}>
                              <motion.div
                                className={`w-full rounded-t-lg ${bar.color} opacity-80`}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(height, bar.count > 0 ? 15 : 0)}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <span className="text-xs text-slate-600">{bar.range}</span>
                            <span className="text-xs font-bold text-slate-400">{bar.count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Status Breakdown */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Pending", status: "PENDING", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/15" },
                      { label: "Shortlisted", status: "SHORTLISTED", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/15" },
                      { label: "Accepted", status: "ACCEPTED", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
                      { label: "Rejected", status: "REJECTED", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/15" },
                    ].map(s => (
                      <div key={s.status} className={`${s.bg} border ${s.border} rounded-xl p-3 flex items-center justify-between`}>
                        <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
                        <span className={`text-lg font-bold ${s.color}`}>
                          {candidate.applications.filter((a: any) => a.status === s.status).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Tips */}
            {completeness < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-5 border border-brand-500/15"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  <h3 className="font-bold">Complete Your Profile</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { done: !!candidate.title, label: "Add your job title" },
                    { done: !!candidate.bio, label: "Write a bio" },
                    { done: !!candidate.location, label: "Add your location" },
                    { done: !!candidate.cvUrl, label: "Upload your CV" },
                    { done: candidate.skills?.length > 0, label: "Add your skills" },
                    { done: !!candidate.education, label: "Add education" },
                    { done: !!candidate.github, label: "Add GitHub profile" },
                    { done: !!candidate.linkedin, label: "Add LinkedIn profile" },
                  ].filter(item => !item.done).map(item => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0" />
                      <span className="text-sm text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/candidate/setup"
                  className="flex items-center justify-center gap-2 w-full mt-4 bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Complete Profile
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}