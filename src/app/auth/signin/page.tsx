"use client"

import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Briefcase, Sparkles, ArrowRight, Building2, User } from "lucide-react"
import { useState } from "react"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<"CANDIDATE" | "COMPANY">("CANDIDATE")

  async function handleSignIn() {
    setLoading(true)
    await signIn("google", {
      callbackUrl: role === "CANDIDATE" ? "/candidate/setup" : "/company/setup",
    })
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold">
              Hire<span className="gradient-text">Flow</span>
            </span>
          </div>
          <p className="text-slate-400">AI-Powered Recruitment Platform</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-2 text-center">Welcome back</h2>
          <p className="text-slate-400 text-sm text-center mb-8">Choose your role to get started</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: "CANDIDATE", label: "Job Seeker", icon: User, desc: "Find your dream job" },
              { id: "COMPANY", label: "Company", icon: Building2, desc: "Find top talent" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id as any)}
                className={`p-4 rounded-2xl border transition-all text-left ${
                  role === r.id
                    ? "border-brand-500/50 bg-brand-500/10"
                    : "border-white/8 bg-white/3 hover:border-white/15"
                }`}
              >
                <r.icon className={`w-5 h-5 mb-2 ${role === r.id ? "text-brand-400" : "text-slate-400"}`} />
                <p className={`font-semibold text-sm ${role === r.id ? "text-white" : "text-slate-300"}`}>
                  {r.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          {/* Google Sign In */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          {/* Features */}
          <div className="mt-6 space-y-2">
            {[
              "AI-powered job matching",
              "Instant CV analysis",
              "Smart candidate screening",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-xs text-slate-400">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          By continuing, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  )
}