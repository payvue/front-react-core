export const normalizeCommunityRole = (role?: string): 'leader' | 'member' => {
  const normalized = role?.toLowerCase()

  if (normalized === 'leader' || normalized === 'admin') {
    return 'leader'
  }

  return 'member'
}

export const isLeaderRole = (role?: string) => normalizeCommunityRole(role) === 'leader'
