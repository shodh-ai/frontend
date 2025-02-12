"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type React from "react" 

export default function LoginPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add login logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4">
      <div className="w-full max-w-[1080px] bg-gradient-to-br from-[#020617]/10 to-[#0f172a]/10 backdrop-blur-md rounded-[20px] overflow-hidden flex flex-col md:flex-row">
        {!isMobile && (
          <div className="w-full md:w-1/2 relative h-[300px] md:h-auto">
            <Image
              src="/loginImg.jpg"
              alt="Geometric Pattern"
              layout="fill"
              objectFit="cover"
              className="rounded-t-[20px] md:rounded-l-[20px] md:rounded-tr-none"
              priority
            />
          </div>
        )}

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-opp-bakground-gradient">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8">
                <Image src="/ShodhLogo.svg" alt="Shodh AI Logo" width={32} height={32} />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-white">Shodh AI</h1>
            </div>
            <p className="text-[#94A3B8] text-sm md:text-base">AI-Powered Insights for Smarter Learning.</p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-10">Let&apos;s Get Started!</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 md:py-3.5 bg-[#1e293b]/50 rounded-lg text-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition-all duration-200"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 md:py-3.5 bg-[#1e293b]/50 rounded-lg text-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 md:py-3.5 mt-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE8] text-white rounded-lg transition-all duration-200 font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

