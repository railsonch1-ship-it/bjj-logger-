import { TrainingLog, FocusTechnique, GamePlan, HealthStatus, Instructor, Academy, Achievement } from './types';

export const INITIAL_INSTRUCTORS: Instructor[] = [
  { id: 'inst-1', name: 'Mestre Marcus Cavaca' },
  { id: 'inst-2', name: 'Professor Bráulio Estima' },
  { id: 'inst-3', name: 'Instrutor Felipe Pena' }
];

export const INITIAL_ACADEMIES: Academy[] = [
  { id: 'acad-1', name: 'Alliance Jiu-Jitsu HQ' },
  { id: 'acad-2', name: 'Gracie Barra' }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'Casca Grossa', description: 'Realizou 5 sessões de treino com kimono (Gi).', iconName: 'ShieldAlert', unlockedAt: '2026-05-15T18:00:00Z' },
  { id: 'ach-2', title: 'Finalizador Nato', description: 'Acumulou mais de 10 finalizações aplicadas em sparring.', iconName: 'Flame', unlockedAt: '2026-05-22T19:00:00Z' },
  { id: 'ach-3', title: 'Indiana Jones', description: 'Escapou com sucesso de 5 situações críticas extremas.', iconName: 'Compass', unlockedAt: '2026-05-28T17:30:00Z' },
  { id: 'ach-4', title: 'Resiliência Suprema', description: 'Manteve constância de treinos por 3 semanas consecutivas.', iconName: 'Zap' },
  { id: 'ach-5', title: 'Mestre do Jogo', description: 'Estruturou as 3 primeiras condicionais do seu Game Plan.', iconName: 'Award' }
];

export const INITIAL_LOGS: TrainingLog[] = [
  {
    id: 'log-1',
    date: '2026-05-14T18:30:00Z',
    modality: 'gi',
    environment: 'normal',
    rounds: 6,
    totalDuration: 90,
    roundDuration: 6,
    restDuration: 1,
    cardio: 4,
    intensity: 4,
    combatStats: {
      submissions: 2,
      taps: 1,
      escapes: 3,
      sweeps: 2,
      takedowns: 1,
      passes: 2
    },
    wentWell: 'As raspagens de meia-guarda funcionaram muito bem hoje.',
    needsImprovement: 'Meu gás falhou um pouco no final do 5º round.',
    instructorId: 'inst-1',
    academyId: 'acad-1',
    isQuick: false
  },
  {
    id: 'log-2',
    date: '2026-05-18T19:00:00Z',
    modality: 'nogi',
    environment: 'open_mat',
    rounds: 8,
    totalDuration: 100,
    roundDuration: 5,
    restDuration: 2,
    cardio: 5,
    intensity: 5,
    combatStats: {
      submissions: 4,
      taps: 2,
      escapes: 4,
      sweeps: 1,
      takedowns: 3,
      passes: 1
    },
    wentWell: 'Ótimas transições de quedas para controle lateral (Scrambles).',
    needsImprovement: 'Acabei cedendo as costas ao tentar dar o sprawl desatento.',
    instructorId: 'inst-3',
    academyId: 'acad-1',
    isQuick: false
  },
  {
    id: 'log-3',
    date: '2026-05-21T18:00:00Z',
    modality: 'gi',
    environment: 'normal',
    rounds: 5,
    totalDuration: 90,
    roundDuration: 6,
    restDuration: 1,
    cardio: 3,
    intensity: 3,
    combatStats: {
      submissions: 1,
      taps: 0,
      escapes: 2,
      sweeps: 2,
      takedowns: 0,
      passes: 3
    },
    wentWell: 'Passagem de guarda lapela-cross funcionou excelente.',
    needsImprovement: 'Postura na guarda fechada precisa ser mais alta.',
    instructorId: 'inst-2',
    academyId: 'acad-2',
    isQuick: false
  },
  {
    id: 'log-4',
    date: '2026-05-25T18:30:00Z',
    modality: 'gi',
    environment: 'normal',
    rounds: 6,
    totalDuration: 90,
    roundDuration: 6,
    restDuration: 1,
    cardio: 4,
    intensity: 4,
    combatStats: {
      submissions: 3,
      taps: 1,
      escapes: 2,
      sweeps: 1,
      takedowns: 1,
      passes: 2
    },
    wentWell: 'Ataques na gola cruzada a partir da montada.',
    needsImprovement: 'Estava telegrafando a chave de braço na guarda.',
    instructorId: 'inst-1',
    academyId: 'acad-1',
    isQuick: false
  },
  {
    id: 'log-5',
    date: '2026-05-28T19:00:00Z',
    modality: 'nogi',
    environment: 'private',
    rounds: 4,
    totalDuration: 60,
    roundDuration: 5,
    restDuration: 1,
    cardio: 4,
    intensity: 3,
    combatStats: {
      submissions: 2,
      taps: 0,
      escapes: 3,
      sweeps: 0,
      takedowns: 2,
      passes: 2
    },
    wentWell: 'Defesa de guilhotina e controle de esgrima.',
    needsImprovement: 'Estabilizar melhor o joelho na barriga.',
    instructorId: 'inst-2',
    academyId: 'acad-1',
    isQuick: true
  },
  {
    id: 'log-6',
    date: '2026-06-01T18:30:00Z',
    modality: 'gi',
    environment: 'normal',
    rounds: 7,
    totalDuration: 90,
    roundDuration: 6,
    restDuration: 1,
    cardio: 4,
    intensity: 4,
    combatStats: {
      submissions: 2,
      taps: 2,
      escapes: 1,
      sweeps: 3,
      takedowns: 1,
      passes: 1
    },
    wentWell: 'Raspei duas vezes da guarda de gancho.',
    needsImprovement: 'Fui pego no triângulo por deixar o braço solto.',
    instructorId: 'inst-1',
    academyId: 'acad-1',
    isQuick: false
  },
  {
    id: 'log-7',
    date: '2026-06-03T18:30:00Z',
    modality: 'nogi',
    environment: 'open_mat',
    rounds: 6,
    totalDuration: 80,
    roundDuration: 6,
    restDuration: 1,
    cardio: 4,
    intensity: 4,
    combatStats: {
      submissions: 3,
      taps: 1,
      escapes: 2,
      sweeps: 1,
      takedowns: 2,
      passes: 2
    },
    wentWell: 'Chaves de calcanhar extremamente rápidas no leg entangle.',
    needsImprovement: 'Ajuste final da pressão do escorrega de quadril.',
    instructorId: 'inst-3',
    academyId: 'acad-1',
    isQuick: false
  }
];

export const INITIAL_FOCUS_TECHNIQUES: FocusTechnique[] = [
  {
    id: 'focus-1',
    name: 'Defesa de Costas (Fuga de Ombros)',
    successGoal: 20,
    successfulReps: 14,
    totalAttempts: 22,
    windowDays: 30,
    startDate: '2026-05-18T12:00:00Z',
    tutorialLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    tutorialPlatform: 'youtube'
  },
  {
    id: 'focus-2',
    name: 'Passagem de Guarda Toureada',
    successGoal: 30,
    successfulReps: 10,
    totalAttempts: 18,
    windowDays: 60,
    startDate: '2026-05-28T12:00:00Z',
    tutorialLink: 'https://www.instagram.com',
    tutorialPlatform: 'instagram'
  }
];

export const INITIAL_GAME_PLAN: GamePlan = {
  identity: 'hibrido',
  style: 'contra_ataque',
  archetype: 'pegador_costas',
  techniques: [
    { id: 'tech-1', name: 'Raspagem Balão de Meia-Guarda', position: 'guard', description: 'Usa a esgrima profunda e desequilíbrio na canela para emborcar e capotar o oponente por cima.' },
    { id: 'tech-2', name: 'Passagem Toureada Lateral', position: 'pass', description: 'Tirar os apoios da calça do adversário e contornar girando em explosão para o controle lateral.' },
    { id: 'tech-3', name: 'Queda Single Leg para Double', position: 'standup', description: 'Simula o avanço na perna única, faz a transição de pegada rápida cortando o quadril para derrubar.' }
  ],
  rules: [
    { id: 'rule-1', trigger: 'O oponente faz postura de pé na minha guarda fechada', technique: 'Entro debaixo do quadril e raspo com o balão (tomoe nage)' },
    { id: 'rule-2', trigger: 'O oponente tenta esgrimado levantar da meia-guarda', technique: 'Bloqueio o ombro com o joelho cruzado e ataco o triângulo de mão' },
    { id: 'rule-3', trigger: 'O oponente chuta forte para defender a leg lock', technique: 'Subo fazendo o sweep e ganho a passagem de toureada direta' }
  ],
  criticalEscapes: [
    { id: 'esc-1', position: 'Montada por cima pesada', plan: 'Fazer ponte explosiva, prender o pé oposto e deslizar o joelho para recompor meia guarda cotovelo-quadril.' },
    { id: 'esc-2', position: 'Triângulo encaixado', plan: 'Fazer postura alta imediatamente, caminhar para cima do oponente, embutir o ombro e empurrar o quadril para baixo aliviando a artéria.' }
  ],
  mentalReminders: [
    'Respirar profundamente quando estiver travado por baixo na pressão.',
    'Nunca esticar os braços totalmente enquanto estiver defendendo a guarda.',
    'Controlar a lapela e manter o calcanhar ativo nas passagens de pressão.'
  ],
  competitionName: 'Campeonato Estadual BJJ',
  competitionDate: '2026-07-15T09:00:00Z'
};

export const INITIAL_HEALTH: HealthStatus = {
  injuries: [
    { id: 'inj-1', date: '2026-05-24', description: 'Leve torção no punho direito ao apoiar em sprawl', severity: 'mild' }
  ],
  isRecoveryTimeOff: false
};
