"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Briefcase, Bell, ChevronDown,
  User, Settings, LogOut, Building2,
  Search, LayoutDashboard
} from "lucide-react"
import { useState } from "react"
import { getInitials } from "@/lib/utils"

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  const isCandidate = session?.user?.role === "CANDIDATE"
  const isCompany = session?.user?.role === "COMPANY"

  const navLinks = isCandidate
    ? [
        { label: "Jobs", href: "/jobs", icon: Search },
        { label: "My Applications", href: "/candidate/applications", icon: Briefcase },
        { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
      ]
    : isCompany
    ? [
        { label: "Post Job", href: "/company/post-job", icon: Briefcase },
        { label: "My Jobs", href: "/company/jobs", icon: Building2 },
        { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
      ]
    : [
        { label: "Jobs", href: "/jobs", icon: Search },
      ]

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">
            Hire<span className="gradient-text">Flow</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                pathname === link.href
                  ? "bg-brand-500/15 text-brand-400 border border-brand-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {getInitials(session.user.name || "U")}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden md:block">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 top-12 w-48 glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/8"
                  >
                    <div className="p-2">
                      <Link
                        href={isCandidate ? "/candidate/profile" : "/company/profile"}
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-white/8 my-1" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signin"
                className="text-sm bg-brand-500 hover:bg-brand-400 text-white font-semibold px-4 py-2 rounded-xl transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}