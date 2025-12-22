export interface SessionScore {
  playerId: string
  score: number // ≠ 0
}

export interface Session {
  id: string
  index: number
  scores: SessionScore[]
  createdAt: number
}