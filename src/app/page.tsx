"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Briefcase, Sparkles, ArrowRight, Brain,
  Target, Users, Building2, Star, TrendingUp,
  CheckCircle, Zap
} from "lucide-react"

const STATS = [
  { value: "10K+", label: "Active Jobs" },
  { value: "50K+", label: "Candidates" },
  { value: "95%", label: "Match Rate" },
  { value: "2x", label: "Faster Hiring" },
]

const FEATURES = [
  {
    icon: Brain,
    title: "AI CV Analysis",
    desc: "Upload your CV and AI extracts your skills, experience, and builds your professional profile automatically",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/15",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    desc: "AI matches you with the most relevant jobs based on your skills, experience, and preferences",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/15",
  },
  {
    icon: Star,
    title: "AI Fit Scoring",
    desc: "Every application gets an AI score (0-100%) with detailed reasoning on strengths and gaps",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/15",
  },
  {
    icon: Zap,
    title: "Instant Screening",
    desc: "Companies get AI-powered candidate screening with auto-generated interview questions",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/15",
  },
  {
    icon: TrendingUp,
    title: "Cover Letter AI",
    desc: "Generate personalized cover letters for each job with one click",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/15",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Companies can manage hiring pipeline with team notes, status tracking, and decisions",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/15",
  },
]

const HOW_IT_WORKS = [
  { step: "01", title: "Sign Up", desc: "Create your account as a candidate or company in seconds", icon: Users },
  { step: "02", title: "Build Profile", desc: "Upload your CV — AI builds your complete professional profile", icon: Brain },
  { step: "03", title: "Get Matched", desc: "AI finds the best jobs or candidates based on compatibility", icon: Target },
  { step: "04", title: "Get Hired", desc: "Apply with AI-powered cover letters and track your applications", icon: CheckCircle },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-600/4 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold">
            Hire<span className="gradient-text">Flow</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Pricing"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm text-slate-400 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/signin"
            className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/auth/signin"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm hover:shadow-lg hover:shadow-brand-500/25">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm px-4 py-2 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Powered by LLaMA 3.1 AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
        >
          Hire Smarter.
          <span className="block gradient-text">Get Hired Faster.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          AI-powered recruitment that matches the right candidates with the right jobs.
          Upload your CV — get matched, scored, and hired in days, not months.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            href="/auth/signin"
            className="group flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-2xl transition-all text-lg hover:shadow-2xl hover:shadow-brand-500/30 hover:scale-105"
          >
            <Users className="w-5 h-5" />
            Find Jobs with AI
          </Link>
          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-2 glass hover:bg-white/8 text-white font-semibold px-8 py-4 rounded-2xl transition-all text-lg border border-white/10"
          >
            <Building2 className="w-5 h-5" />
            Post a Job
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="glass rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Everything you need to
            <span className="gradient-text"> hire smarter</span>
          </motion.h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            AI does the heavy lifting — you focus on making the right decision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card rounded-2xl p-6 border ${feature.border} hover:scale-[1.02] transition-all group`}
            >
              <div className={`w-11 h-11 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">How it <span className="gradient-text">Works</span></h2>
          <p className="text-slate-400 text-lg">Get hired in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-brand-500/30 to-transparent" />
              )}
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                <step.icon className="w-7 h-7 text-brand-400" />
              </div>
              <div className="text-xs text-brand-400 font-bold mb-1">{step.step}</div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-border rounded-3xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Ready to find your <span className="gradient-text">dream job?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of candidates and companies already using HireFlow
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-10 py-4 rounded-2xl transition-all text-lg hover:shadow-2xl hover:shadow-brand-500/30 hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Get Started Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">HireFlow</span>
          </div>
          <p className="text-slate-600 text-sm">Built by Mohammed Sherif</p>
        </div>
      </footer>
    </div>
  )
}