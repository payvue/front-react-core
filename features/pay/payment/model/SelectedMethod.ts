export type SelectedMethod = 
  | { type: 'provider'; id: string | null }
  | { type: 'card'; id: string | null }
  | null
