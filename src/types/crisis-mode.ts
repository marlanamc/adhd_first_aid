export interface CrisisModeFeeling {
  id: string
  feeling_name: string
  description: string
  strategies: string[]
  icon: string
  created_at: string
  updated_at: string
}

export interface CrisisModeBarrier {
  id: string
  barrier_name: string
  description: string
  strategies: string[]
  icon: string
  created_at: string
  updated_at: string
}

export interface CrisisModeComplexLoop {
  id: string
  loop_name: string
  description: string
  strategies: string[]
  icon: string
  created_at: string
  updated_at: string
}

export interface CrisisModeLifeArea {
  id: string
  life_area_name: string
  description: string
  strategies: string[]
  icon: string
  created_at: string
  updated_at: string
}

export interface CrisisModeIdentity {
  id: string
  identity_name: string
  description: string
  strategies: string[]
  icon: string
  created_at: string
  updated_at: string
}

export type CrisisModeContent =
  | CrisisModeFeeling
  | CrisisModeBarrier
  | CrisisModeComplexLoop
  | CrisisModeLifeArea
  | CrisisModeIdentity

export type ContentType = 'feeling' | 'barrier' | 'complex_loop' | 'life_area' | 'identity'