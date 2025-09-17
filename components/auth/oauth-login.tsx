"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Chrome, Github } from "lucide-react"

interface OAuthLoginProps {
  onOAuthLogin: (provider: string) => void
}

export function OAuthLogin({ onOAuthLogin }: OAuthLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(provider)

    // Simulate OAuth process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock OAuth response - simulate new user vs existing user
    const isExistingUser = Math.random() > 0.5

    if (isExistingUser) {
      // Existing user - direct login
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "oauth-" + Date.now(),
          email: `user@${provider}.com`,
          name: "OAuth 사용자",
          balance: 75000,
          isLoggedIn: true,
          provider,
        }),
      )
      window.location.href = "/dashboard"
    } else {
      // New user - redirect to additional info page
      localStorage.setItem(
        "oauthTemp",
        JSON.stringify({
          provider,
          email: `newuser@${provider}.com`,
          name: `${provider} 사용자`,
        }),
      )
      window.location.href = "/auth/complete-profile"
    }

    setIsLoading(null)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading !== null}
        >
          {isLoading === "google" ? (
            "Google 로그인 중..."
          ) : (
            <>
              <Chrome className="mr-2 h-4 w-4" />
              Google로 로그인
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => handleOAuthLogin("github")}
          disabled={isLoading !== null}
        >
          {isLoading === "github" ? (
            "GitHub 로그인 중..."
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              GitHub로 로그인
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
