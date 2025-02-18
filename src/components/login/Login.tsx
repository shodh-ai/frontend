"use client";
import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { useAppDispatch } from "@/src/hooks/reduxHooks";
import { loginwithPassword } from "@/src/features/auth/auththunks";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [invalidPass, setInvalidPass] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      loginwithPassword({ username: username, password: password, role: 3 })
    ).unwrap()
      .then(() => {toast.success("Logged in Successfully!"); router.push("/")})
      .catch((err) => {console.error("Error while logging ", err); setInvalidPass(true)});
  };

  return (
    <div className=" h-[100vh] flex items-center justify-center bg-[#000000] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[1080px] bg-gradient-to-br from-[#020617]/10 to-[#0f172a]/10 backdrop-blur-md rounded-[20px] overflow-hidden flex flex-col lg:flex-row">
        <div className="hidden lg:block w-1/2 relative">
          <Image
            src={"/loginImg.jpg"}
            alt="Geometric Pattern"
            fill
            sizes=""
            style={{ objectFit: "cover" }}
            className="rounded-l-[20px]"
            priority
          />
        </div>

        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-opp-bakground-gradient">
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="flex justify-center items-center gap-3 mb-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                <Image
                  src={"/ShodhLogo.svg"}
                  alt="Shodh AI Logo"
                  width={32}
                  height={32}
                />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Shodh AI
              </h1>
            </div>
            <p className="text-[#94A3B8] text-center text-xs sm:text-sm md:text-base">
              AI-Powered Insights for Smarter Learning.
            </p>
          </div>

          <h2 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-10">
            Let&apos;s Get Started!
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 bg-[#1e293b]/50 rounded-lg text-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition-all duration-200 text-sm sm:text-base"
                aria-label="Email"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 bg-[#1e293b]/50 rounded-lg text-white placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] ${invalidPass ? "border border-red-500" : ""} transition-all duration-200 text-sm sm:text-base`}
                aria-label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {invalidPass &&  <div className="text-red-600  text-center text-base font-semibold">Invalid Password</div>}
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 md:py-3.5 mt-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE8] text-white rounded-lg transition-all duration-200 font-medium text-sm sm:text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
