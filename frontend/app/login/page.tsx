"use client"

import { motion } from "framer-motion"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl"
      >
        <LoginForm />
      </motion.div>

    </div>
  )
}
