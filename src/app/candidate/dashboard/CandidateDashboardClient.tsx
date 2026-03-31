"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  MapPin,
  Building2,
  ArrowRight,
  Sparkles,
  User,
  FileText,
  Eye,
  Target,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import Navbar from "@/components/Navbare";
import { timeAgo, getInitials } from "@/lib/utils";
import { useEffect , useState } from "react";
import { formatSalary  } from "@/lib/utils";

const STATUS_CONFIG: Record<string, any> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  REVIEWING: {
    label: "Reviewing",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  ACCEPTED: {
    label: "Accepted! 🎉",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
};

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-brand-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
};

const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
const [loadingJobs, setLoadingJobs] = useState(true);

useEffect(()=>{
  fetch("/api/ai/match-jobs")
  .then(res => res.json())
  .then(data => {
    setMatchedJobs(data)
    setLoadingJobs(false)
  })
  .catch(() => setLoadingJobs(false))
})
export default function CandidateDashboardClient({
  candidate,
  session,
  stats,
}: any) {
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
            {session.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-16 h-16 rounded-2xl border border-white/10"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                {getInitials(session.user.name || "U")}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{session.user.name}</h1>
              <p className="text-slate-400">
                {candidate.title || "Add your job title"}
              </p>
              {candidate.location && (
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {candidate.location}
                </div>
              )}
            </div>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            <Target className="w-4 h-4" />
            Find Jobs
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Applied",
              value: stats.total,
              icon: Briefcase,
              color: "text-brand-400",
              bg: "bg-brand-500/10",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "text-yellow-400",
              bg: "bg-yellow-500/10",
            },
            {
              label: "Shortlisted",
              value: stats.shortlisted,
              icon: Star,
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
            {
              label: "Accepted",
              value: stats.accepted,
              icon: CheckCircle,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Avg AI Score",
              value: `${stats.avgScore}%`,
              icon: TrendingUp,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4"
            >
              <div
                className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-lg mb-4">My Applications</h2>

            {candidate.applications.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Briefcase className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">
                  No applications yet
                </p>
                <p className="text-slate-600 text-sm mb-6">
                  Start applying to jobs to track your progress here
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                >
                  Browse Jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {candidate.applications.map((app: any, i: number) => {
                  const status =
                    STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING;
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/jobs/${app.jobId}`}>
                        <div className="glass-card rounded-2xl p-4 hover:border-brand-500/20 transition-all group cursor-pointer">
                          <div className="flex items-center gap-3">
                            {/* Company Logo */}
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                              {app.job.company.logo ? (
                                <img
                                  src={app.job.company.logo}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-slate-500" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <h3 className="font-semibold text-sm group-hover:text-brand-400 transition-colors truncate">
                                  {app.job.title}
                                </h3>
                                <span
                                  className={`text-xs font-medium px-2.5 py-1 rounded-lg border shrink-0 ${status.bg} ${status.border} ${status.color}`}
                                >
                                  {status.label}
                                </span>
                              </div>
                              <p className="text-slate-500 text-xs mb-1.5">
                                {app.job.company.name}
                              </p>
                              <div className="flex items-center gap-3">
                                {app.aiScore && (
                                  <div className="flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                                    <span
                                      className={`text-xs font-bold ${SCORE_COLOR(app.aiScore)}`}
                                    >
                                      {app.aiScore}% Match
                                    </span>
                                  </div>
                                )}
                                <span className="text-xs text-slate-600">
                                  Applied {timeAgo(app.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

{/* AI Job Recommendations */}
<div className="mt-6">
  <div className="flex items-center gap-2 mb-4">
    <Sparkles className="w-5 h-5 text-brand-400" />
    <h2 className="font-bold text-lg">AI Job Recommendations</h2>
  </div>

  {loadingJobs ? (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-white/5 rounded w-1/3 mb-2" />
          <div className="h-3 bg-white/5 rounded w-1/4" />
        </div>
      ))}
    </div>
  ) : (
    <div className="space-y-3">
      {matchedJobs.slice(0, 5).map((job: any) => (
        <Link key={job.id} href={`/jobs/${job.id}`}>
          <div className="glass-card rounded-xl p-4 hover:border-brand-500/20 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {job.company.logo
                  ? <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                  : <Building2 className="w-4 h-4 text-slate-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm group-hover:text-brand-400 transition-colors truncate">
                  {job.title}
                </p>
                <p className="text-xs text-slate-500">{job.company.name} • {job.location}</p>
                {job.matchedSkills?.length > 0 && (
                  <p className="text-xs text-brand-400 mt-0.5">
                    Matches: {job.matchedSkills.slice(0, 3).join(", ")}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-center">
                <p className={`text-lg font-bold ${
                  job.matchScore >= 80 ? "text-green-400" :
                  job.matchScore >= 60 ? "text-brand-400" :
                  job.matchScore >= 40 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {job.matchScore}%
                </p>
                <p className="text-xs text-slate-600">match</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/jobs"
        className="flex items-center justify-center gap-2 py-3 glass rounded-xl text-sm text-slate-400 hover:text-white transition-colors border border-white/8 mt-2"
      >
        Browse All Jobs
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )}
</div>




          {/* Profile Sidebar */}
          <div className="space-y-4">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">My Profile</h3>
                <Link
                  href="/candidate/setup"
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Edit
                </Link>
              </div>

              {/* Profile Completeness */}
              {(() => {
                const fields = [
                  candidate.title,
                  candidate.bio,
                  candidate.location,
                  candidate.cvUrl,
                  candidate.skills?.length > 0,
                  candidate.education,
                ];
                const completed = fields.filter(Boolean).length;
                const pct = Math.round((completed / fields.length) * 100);
                return (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">
                        Profile Completeness
                      </span>
                      <span
                        className={
                          pct === 100 ? "text-green-400" : "text-brand-400"
                        }
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <motion.div
                        className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-2.5">
                {[
                  { icon: User, label: "Title", value: candidate.title },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: candidate.location,
                  },
                  {
                    icon: Briefcase,
                    label: "Experience",
                    value: candidate.experience
                      ? `${candidate.experience} years`
                      : null,
                  },
                  {
                    icon: FileText,
                    label: "Education",
                    value: candidate.education,
                  },
                  {
                    icon: Eye,
                    label: "Available",
                    value: candidate.available
                      ? "Open to work"
                      : "Not available",
                  },
                ].map(
                  (item) =>
                    item.value && (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 text-xs"
                      >
                        <item.icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-slate-500">{item.label}:</span>
                        <span className="text-slate-300 truncate">
                          {item.value}
                        </span>
                      </div>
                    ),
                )}
              </div>

              {/* Links */}
              <div className="flex gap-2 mt-4">
                {candidate.github && (
                  <a
                    href={candidate.github}
                    target="_blank"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg border border-white/8"
                  >
                    <FaGithub className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                )}
                {candidate.linkedin && (
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg border border-white/8"
                  >
                    <FaLinkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}
                {candidate.cvUrl && (
                  <a
                    href={candidate.cvUrl}
                    target="_blank"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg border border-white/8"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    CV
                  </a>
                )}
              </div>
            </motion.div>

            {/* Skills */}
            {candidate.skills?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-5"
              >
                <h3 className="font-bold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-2xl p-5"
            >
              <h3 className="font-bold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Browse All Jobs", href: "/jobs", icon: Target },
                  {
                    label: "Update Profile",
                    href: "/candidate/setup",
                    icon: User,
                  },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 text-sm text-slate-400 group-hover:text-white transition-colors">
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
