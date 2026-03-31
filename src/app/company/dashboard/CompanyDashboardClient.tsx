"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Briefcase, Users, Eye, TrendingUp,
  Plus, ArrowRight, Building2, Star,
  Sparkles, Clock, CheckCircle, XCircle,
  MapPin, Wifi
} from "lucide-react"
import Navbar from "@/components/Navbare"
import { timeAgo, getInitials } from "@/lib/utils"

const STATUS_CONFIG: Record<string, any> = {
  PENDING: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  REVIEWING: { label: "Reviewing", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  SHORTLISTED: { label: "Shortlisted", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  REJECTED: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ACCEPTED: { label: "Accepted", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
}

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return "text-green-400"
  if (score >= 60) return "text-brand-400"
  if (score >= 40) return "text-yellow-400"
  return "text-red-400"
}

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time", PART_TIME: "Part Time",
  CONTRACT: "Contract", FREELANCE: "Freelance", INTERNSHIP: "Internship",
}

export default function CompanyDashboardClient({ company, session, stats }: any) {
  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
              {company.logo
                ? <img src={company.logo} alt="" className="w-full h-full object-cover" />
                : <Building2 className="w-7 h-7 text-slate-500" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{company.name}</h1>
                {company.verified && (
                  <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-slate-400">{company.industry} • {company.location}</p>
            </div>
          </div>
          <Link
            href="/company/post-job"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase, color: "text-brand-400", bg: "bg-brand-500/10" },
            { label: "Active Jobs", value: stats.activeJobs, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Applications", value: stats.totalApplications, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
            { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Jobs List */}
        <h2 className="font-bold text-lg mb-4">My Job Postings</h2>

        {company.jobs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Briefcase className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">No jobs posted yet</p>
            <p className="text-slate-600 text-sm mb-6">Post your first job and start receiving AI-scored applications</p>
            <Link
              href="/company/post-job"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Post First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {company.jobs.map((job: any, i: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                        job.status === "ACTIVE"
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </div>
                      <span>{TYPE_LABELS[job.type]}</span>
                      {job.remote && (
                        <div className="flex items-center gap-1.5 text-green-400">
                          <Wifi className="w-3.5 h-3.5" />
                          Remote
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(job.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm shrink-0">
                    <div className="text-center">
                      <p className="font-bold text-lg">{job._count.applications}</p>
                      <p className="text-slate-500 text-xs">Applicants</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{job.views}</p>
                      <p className="text-slate-500 text-xs">Views</p>
                    </div>
                  </div>
                </div>

                {/* Top Applicants */}
                {job.applications.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                      Top AI-Scored Applicants
                    </p>
                    <div className="space-y-2">
                      {job.applications.map((app: any) => (
                        <div key={app.id} className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-xl px-4 py-2.5">
                          {app.candidate.user.image ? (
                            <img src={app.candidate.user.image} alt="" className="w-8 h-8 rounded-full shrink-0" />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                              {getInitials(app.candidate.user.name || "?")}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{app.candidate.user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{app.candidate.title}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {app.aiScore && (
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                                <span className={`text-sm font-bold ${SCORE_COLOR(app.aiScore)}`}>
                                  {app.aiScore}%
                                </span>
                              </div>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-lg border ${STATUS_CONFIG[app.status]?.bg} ${STATUS_CONFIG[app.status]?.border} ${STATUS_CONFIG[app.status]?.color}`}>
                              {STATUS_CONFIG[app.status]?.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  <Link
                    href={`/company/jobs/${job.id}/applications`}
                    className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors px-3 py-1.5 bg-brand-500/10 rounded-lg border border-brand-500/20"
                  >
                    <Users className="w-3.5 h-3.5" />
                    View All Applicants
                  </Link>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg border border-white/8"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview Job
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}