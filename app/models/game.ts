import type { Player } from './player'
import type { Session } from './session'

export interface Game {
  id: string
  players: Player[]
  sessions: Session[]
  status: 'active' | 'finished'
  createdAt: number
  finishedAt?: number
}