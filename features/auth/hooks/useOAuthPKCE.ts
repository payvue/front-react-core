const toBase64Url = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const generateRandomString = (length: number) => {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const sha256 = async (input: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  return crypto.subtle.digest('SHA-256', data)
}

export const useOAuthPKCE = () => {
  const createVerifier = () => generateRandomString(64)

  const createChallenge = async (verifier: string) => {
    const hashed = await sha256(verifier)
    return toBase64Url(hashed)
  }

  const createState = () => generateRandomString(32)

  return {
    createVerifier,
    createChallenge,
    createState,
  }
}
