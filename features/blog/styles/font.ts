import { IBM_Plex_Sans_KR, Noto_Serif_KR } from 'next/font/google'

export const blogUiFont = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const blogBodyFont = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})
