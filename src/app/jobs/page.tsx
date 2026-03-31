"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Search, MapPin, Briefcase, Filter,
  Wifi, Star, Clock, DollarSign, Building2,
  ArrowRight, SlidersHorizontal
} from "lucide-react"
import { formatSalary, timeAgo } from "@/lib/utils"
import Navbar from "@/components/Navbare"

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"]
const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("")
  const [remote, setRemote] = useState(false)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  async function fetchJobs() {
    setLoading(true)
    const params = new URLSearchParams({
      search, location, type, page: page.toString(),
      ...(remote && { remote: "true" })
    })
    const res = await fetch(`/api/jobs?${params}`)
    const data = await res.json()
    setJobs(data.jobs || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [search, location, type, remote, page])

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />

      {/* Hero Search */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-brand-500/5 to-transparent">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-3">
              Find Your <span className="gradient-text">Dream Job</span>
            </h1>
            <p className="text-slate-400">{total.toLocaleString()} jobs available</p>
          </motion.div>

          {/* Search Bar */}
          <div className="flex gap-3 flex-col md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, skills, or company..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 text-sm"
              />
            </div>
            <div className="relative md:w-56">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-4 rounded-2xl border transition-all text-sm font-medium ${
                showFilters
                  ? "border-brand-500/40 bg-brand-500/10 text-brand-400"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 mt-4"
            >
              {JOB_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(type === t ? "" : t)}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                    type === t
                      ? "border-brand-500/40 bg-brand-500/10 text-brand-400"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
              <button
                onClick={() => setRemote(!remote)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${
                  remote
                    ? "border-green-500/40 bg-green-500/10 text-green-400"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Wifi className="w-4 h-4" />
                Remote Only
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-1/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">No jobs found</p>
            <p className="text-slate-600 text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/jobs/${job.id}`}>
                  <div className={`glass-card rounded-2xl p-5 hover:border-brand-500/20 transition-all group cursor-pointer ${
                    job.featured ? "border-brand-500/15 bg-brand-500/3" : ""
                  }`}>
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {job.company.logo ? (
                          <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-lg group-hover:text-brand-400 transition-colors">
                                {job.title}
                              </h3>
                              {job.featured && (
                                <span className="flex items-center gap-1 text-xs bg-yellow-500/15 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                  <Star className="w-3 h-3" />
                                  Featured
                                </span>
                              )}
                              {job.company.verified && (
                                <span className="text-xs bg-blue-500/15 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm">{job.company.name}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-brand-400 transition-colors shrink-0 mt-1" />
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Briefcase className="w-3.5 h-3.5" />
                            {TYPE_LABELS[job.type]}
                          </div>
                          {job.remote && (
                            <div className="flex items-center gap-1.5 text-xs text-green-400">
                              <Wifi className="w-3.5 h-3.5" />
                              Remote
                            </div>
                          )}
                          {(job.salaryMin || job.salaryMax) && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <DollarSign className="w-3.5 h-3.5" />
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="w-3.5 h-3.5" />
                            {timeAgo(job.createdAt)}
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.slice(0, 5).map((skill: string) => (
                            <span key={skill} className="px-2.5 py-1 bg-white/5 border border-white/8 text-slate-400 rounded-lg text-xs">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="px-2.5 py-1 bg-white/5 border border-white/8 text-slate-500 rounded-lg text-xs">
                              +{job.skills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Pagination */}
            {total > 10 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 glass rounded-xl text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors border border-white/8"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {page} of {Math.ceil(total / 10)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(total / 10)}
                  className="px-4 py-2 glass rounded-xl text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors border border-white/8"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}