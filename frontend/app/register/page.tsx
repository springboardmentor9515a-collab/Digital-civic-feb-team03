"use client"

import { motion } from "framer-motion"
import RegisterForm from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl"
      >
        <RegisterForm />
      </motion.div>

    </div>
  )
}
