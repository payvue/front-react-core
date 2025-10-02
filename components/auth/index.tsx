"use client"

import type React from "react"
import { OAuthLogin } from "./oauth-login"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import useAuthQuery from "@/features/auth/useAuthQuery"
import { useRouter } from "next/navigation"
import { RecoveryForm } from "./recovery"
import { LoginForm } from "./login"

interface LoginFormInputs {
  email: string
  password: string
}

export function LoginCenter() {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[500px]">
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        showPassword ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        <LoginForm convert={() => setShowPassword(true)} />
      </div>

      <div className={`absolute inset-0 transition-opacity duration-300 ${
        showPassword ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
        <RecoveryForm convert = {() => setShowPassword(false)}/>
      </div>

    </div>
  );


}
