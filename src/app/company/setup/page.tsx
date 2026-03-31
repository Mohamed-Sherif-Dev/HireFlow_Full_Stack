"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Building2, Globe, MapPin, Users, ArrowRight, Upload, CheckCircle } from "lucide-react"

const INDUSTRIES = ["Software", "Fintech", "E-commerce", "Healthcare", "Education", "Marketing", "Design", "Other"]
const SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"]

export default function CompanySetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [form, setForm] = useState({
    name: "", website: "", industry: "", size: "",
    location: "", description: "",
  })

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!form.name.trim()) return
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (logo) formData.append("logo", logo)

      await fetch("/api/company/setup", { method: "POST", body: formData })
      router.push("/company/dashboard")
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/6 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Set up your Company</h1>
          <p className="text-slate-400">Start hiring the best talent with AI</p>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-5">

          {/* Logo Upload */}
          <div className="flex items-center gap-5">
            <label className="cursor-pointer">
              <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
                logoPreview ? "border-brand-500/40" : "border-white/15 hover:border-brand-500/30"
              }`}>
                {logoPreview ? (
                  <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-7 h-7 text-slate-500" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
            <div>
              <p className="font-semibold text-sm mb-0.5">Company Logo</p>
              <p className="text-xs text-slate-500">Upload your company logo (optional)</p>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Company Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Tech Corp"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
              <select
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 text-sm"
              >
                <option value="" className="bg-slate-900">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i} className="bg-slate-900">{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Company Size</label>
              <select
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 text-sm"
              >
                <option value="" className="bg-slate-900">Select size</option>
                {SIZES.map(s => <option key={s} value={s} className="bg-slate-900">{s} employees</option>)}
              </select>
            </div>
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
              <label className="block text-sm font-medium text-slate-400 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell candidates about your company..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500/50 text-sm resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition-all text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Setup
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}