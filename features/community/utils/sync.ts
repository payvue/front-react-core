export const COMMUNITY_REFRESH_EVENT = 'community:refresh'

export const requestCommunityRefresh = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(COMMUNITY_REFRESH_EVENT))
}
