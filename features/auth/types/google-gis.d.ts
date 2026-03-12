export {}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: {
            client_id: string
            scope: string
            ux_mode: 'popup'
            callback: (response: {
              code?: string
              scope?: string
              state?: string
              error?: string
              error_description?: string
              error_uri?: string
            }) => void
            state?: string
            prompt?: string
            hosted_domain?: string
          }) => {
            requestCode: () => void
          }
        }
      }
    }
  }
}
