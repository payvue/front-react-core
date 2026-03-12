'use client'

import { useOAuthStorage } from '@/features/auth/hooks/useOAuthStorage'

const useOAuthProfile = () => {
  const { getOAuthProfile, clearOAuthProfile } = useOAuthStorage()

  return {
    getOAuthProfile,
    clearOAuthProfile,
  }
}

export default useOAuthProfile
