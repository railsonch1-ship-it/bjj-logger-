export type ModalityType = 'gi' | 'nogi';
export type EnvironmentType = 'normal' | 'private' | 'open_mat';

export interface CombatStats {
  submissions: number;
  taps: number;
  escapes: number;
  sweeps: number;
  takedowns: number;
  passes: number;
}

export interface CombatEvent {
  id: string;
  type: 'submission' | 'tap' | 'escape' | 'sweep' | 'takedown' | 'pass';
  technique: string;
  situation: string;
}

export interface TrainingLog {
  id: string;
  date: string; // ISO date string
  modality: ModalityType;
  environment: EnvironmentType;
  rounds: number;
  totalDuration: number; // in minutes
  roundDuration: number; // in minutes
  restDuration: number; // in minutes
  cardio: number; // 1 to 5
  intensity: number; // 1 to 5 (visual fire rating)
  combatStats: CombatStats;
  combatEvents?: CombatEvent[];
  wentWell: string;
  needsImprovement: string;
  instructorId: string;
  academyId: string;
  isQuick: boolean;
}

export type PlatformType = 'youtube' | 'instagram' | 'tiktok' | 'other';

export interface FocusTechnique {
  id: string;
  name: string;
  successGoal: number;
  successfulReps: number;
  totalAttempts: number; // successful + failures
  windowDays: 30 | 60 | 90;
  startDate: string; // ISO date string
  tutorialLink?: string;
  tutorialPlatform?: PlatformType;
}

export type BJJIdentity = 'guardeiro' | 'passador' | 'hibrido';
export type TacticalStyle = 'movimentacao' | 'pressao' | 'contra_ataque';
export type BJJArchetype = 
  | 'leg_locker' 
  | 'pegador_costas' 
  | 'cacador_bracos' 
  | 'guilhotina' 
  | 'estrangulador' 
  | 'raspador' 
  | 'scrambler';

export interface ConditionalRule {
  id: string;
  trigger: string; // SE oponente...
  technique: string; // ENTÃO...
}

export interface GamePlanTechnique {
  id: string;
  name: string;
  position: 'guard' | 'pass' | 'standup' | 'other';
  description?: string;
}

export interface CriticalEscape {
  id: string;
  position: string; // Ex: Montada, Triângulo
  plan: string; // Plano de fuga
}

export interface GamePlan {
  identity: BJJIdentity;
  style: TacticalStyle;
  archetype: BJJArchetype;
  rules: ConditionalRule[];
  criticalEscapes: CriticalEscape[];
  mentalReminders: string[];
  competitionName: string;
  competitionDate: string; // ISO string
  techniques?: GamePlanTechnique[];
}

export interface Injury {
  id: string;
  date: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface HealthStatus {
  injuries: Injury[];
  isRecoveryTimeOff: boolean;
}

export interface Instructor {
  id: string;
  name: string;
}

export interface Academy {
  id: string;
  name: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string; // ISO string if unlocked
  iconName: string;
}
