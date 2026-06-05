import React, { useState } from 'react';
import { TrainingLog, CombatStats, CombatEvent, ModalityType, EnvironmentType, Instructor, Academy } from '../types';
import { 
  Plus, 
  Minus, 
  Activity, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Zap,
  BookmarkPlus
} from 'lucide-react';

interface TrainingLogFormProps {
  onAddLog: (log: Omit<TrainingLog, 'id'>) => void;
  instructors: Instructor[];
  academies: Academy[];
  onAddInstructor: (name: string) => void;
  onAddAcademy: (name: string) => void;
  isRecoveryActive: boolean; // From the health module, to issue warnings if logging training during recovery!
}

export default function TrainingLogForm({ 
  onAddLog, 
  instructors, 
  academies, 
  onAddInstructor, 
  onAddAcademy,
  isRecoveryActive
}: TrainingLogFormProps) {
  // Modes: Quick (Rápido) vs Detailed (Detalhado)
  const [isQuick, setIsQuick] = useState<boolean>(false);

  // Common fields
  const [modality, setModality] = useState<ModalityType>('gi');
  const [environment, setEnvironment] = useState<EnvironmentType>('normal');
  const [rounds, setRounds] = useState<number>(6);
  const [totalDuration, setTotalDuration] = useState<number>(90);
  const [roundDuration, setRoundDuration] = useState<number>(6);
  const [restDuration, setRestDuration] = useState<number>(1);
  const [cardio, setCardio] = useState<number>(4);
  const [intensity, setIntensity] = useState<number>(3);
  
  // Combat stats
  const [combatStats, setCombatStats] = useState<CombatStats>({
    submissions: 0,
    taps: 0,
    escapes: 0,
    sweeps: 0,
    takedowns: 0,
    passes: 0
  });

  // Combat events details
  const [combatEvents, setCombatEvents] = useState<CombatEvent[]>([]);

  // Qualitative notes
  const [wentWell, setWentWell] = useState<string>('');
  const [needsImprovement, setNeedsImprovement] = useState<string>('');
  const [instructorId, setInstructorId] = useState<string>(instructors[0]?.id || '');
  const [academyId, setAcademyId] = useState<string>(academies[0]?.id || '');

  // Form helpers
  const [tempInstructor, setTempInstructor] = useState<string>('');
  const [tempAcademy, setTempAcademy] = useState<string>('');
  const [showAddInst, setShowAddInst] = useState(false);
  const [showAddAcad, setShowAddAcad] = useState(false);

  // Success state feedback
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const incrementRound = (val: number) => {
    setRounds(prev => Math.max(0, prev + val));
  };

  const handleStatChange = (key: keyof CombatStats, val: number) => {
    const currentVal = combatStats[key];
    const newVal = Math.max(0, currentVal + val);
    const actualDiff = newVal - currentVal;

    if (actualDiff === 0) return;

    // 1. Update stats state
    setCombatStats(prev => ({
      ...prev,
      [key]: newVal
    }));

    // 2. Update combat events side-by-side
    const typeMap: Record<keyof CombatStats, CombatEvent['type']> = {
      submissions: 'submission',
      taps: 'tap',
      escapes: 'escape',
      sweeps: 'sweep',
      takedowns: 'takedown',
      passes: 'pass'
    };
    const type = typeMap[key];

    setCombatEvents(prevEvents => {
      if (actualDiff > 0) {
        // Add entries
        const added: CombatEvent[] = [];
        for (let i = 0; i < actualDiff; i++) {
          added.push({
            id: `${type}-${Date.now()}-${Math.random()}`,
            type,
            technique: '',
            situation: ''
          });
        }
        return [...prevEvents, ...added];
      } else {
        // Remove the last added entry of that type
        const entriesOfType = prevEvents.filter(e => e.type === type);
        if (entriesOfType.length === 0) return prevEvents;
        
        const lastEntry = entriesOfType[entriesOfType.length - 1];
        return prevEvents.filter(e => e.id !== lastEntry.id);
      }
    });
  };

  const handleQuickStatFill = (subs: number, taps: number) => {
    setCombatStats(prev => ({
      ...prev,
      submissions: subs,
      taps: taps
    }));
    setCombatEvents([]);
  };

  const handleAddInstructorLocal = () => {
    if (tempInstructor.trim()) {
      onAddInstructor(tempInstructor.trim());
      setTempInstructor('');
      setShowAddInst(false);
    }
  };

  const handleAddAcademyLocal = () => {
    if (tempAcademy.trim()) {
      onAddAcademy(tempAcademy.trim());
      setTempAcademy('');
      setShowAddAcad(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const logPayload: Omit<TrainingLog, 'id'> = {
      date: new Date().toISOString(),
      modality,
      environment,
      rounds,
      totalDuration: Number(totalDuration),
      roundDuration: Number(roundDuration),
      restDuration: Number(restDuration),
      cardio,
      intensity,
      combatStats: isQuick ? {
        submissions: combatStats.submissions,
        taps: combatStats.taps,
        escapes: 0,
        sweeps: 0,
        takedowns: 0,
        passes: 0
      } : combatStats,
      combatEvents: isQuick ? [] : combatEvents,
      wentWell: isQuick ? 'Registro rápido de treino' : wentWell,
      needsImprovement: isQuick ? 'Registro rápido de treino' : needsImprovement,
      instructorId: instructorId || (instructors[0]?.id || ''),
      academyId: academyId || (academies[0]?.id || ''),
      isQuick
    };

    onAddLog(logPayload);
    
    // Reset state & show Toast confirmation
    setWentWell('');
    setNeedsImprovement('');
    setCombatStats({
      submissions: 0,
      taps: 0,
      escapes: 0,
      sweeps: 0,
      takedowns: 0,
      passes: 0
    });
    setCombatEvents([]);
    
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Recovery Warning Indicator if athlete is resting */}
      {isRecoveryActive && (
        <div className="bg-amber-950/40 border border-amber-800 p-4 rounded-xl flex items-start gap-3 text-amber-300">
          <Zap className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold tracking-wide">AVISO: Período de Recuperação Ativo!</h4>
            <p className="text-slate-300">
              Você marcou uma folga para reabilitação médica nas configurações de Saúde. Registrar treinos intensos agora pode sobrecarregar suas lesões e atrasar a cura definitiva. Treine com cuidado redobrado!
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="bg-emerald-950/40 border border-emerald-800 p-4 rounded-xl flex items-center gap-3 text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold">Treino Registrado com Sucesso!</h4>
            <p className="text-slate-300 font-sans">Sua telemetria foi gravada e agregada aos gráficos de evolução no terminal principal.</p>
          </div>
        </div>
      )}

      {/* Mode Toggle: Quick vs Detailed */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="font-display font-semibold text-sm text-slate-200">Escolha o Tipo de Registro</h3>
          <p className="text-xs text-slate-400">Rápido para salvar em segundos pós-treino ou Detalhado para exames táticos rigorosos.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setIsQuick(true)}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              isQuick 
                ? 'bg-slate-800 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Rápido (+/- 10s)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsQuick(false)}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              !isQuick 
                ? 'bg-slate-800 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Detalhado Completo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Essential Volume & Presets */}
        <div className="space-y-6">
          
          {/* Section: Basic Info Modality & Environmental */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm text-slate-200">Modalidade & Ambiente</h3>
            </div>

            {/* Modality Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-mono block">Diferenciação de Vestimenta (Modalidade):</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModality('gi')}
                  className={`p-3 rounded-lg border text-sm font-semibold transition-all ${
                    modality === 'gi'
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                  }`}
                >
                  🥋 Com Kimono (Gi)
                </button>
                <button
                  type="button"
                  onClick={() => setModality('nogi')}
                  className={`p-3 rounded-lg border text-sm font-semibold transition-all ${
                    modality === 'nogi'
                      ? 'bg-orange-950/40 border-orange-500 text-orange-300'
                      : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                  }`}
                >
                  🤼 Sem Kimono (No-Gi)
                </button>
              </div>
            </div>

            {/* Environment Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-mono block">Categorização de Treino (Ambiente):</label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'private', 'open_mat'] as EnvironmentType[]).map((env) => {
                  const labels = { normal: 'Aula Comum', private: 'Particular', open_mat: 'Open Mat' };
                  const icons = { normal: '👥', private: '🎯', open_mat: '👐' };
                  return (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setEnvironment(env)}
                      className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition-all ${
                        environment === env
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-850'
                      }`}
                    >
                      <span className="block text-base mb-1">{icons[env]}</span>
                      <span>{labels[env]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Physiological / Load Metrics */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-sm text-slate-200">Métricas de Fisiologia e Carga</h3>
            </div>

            {/* Volumetric numerical details */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-mono block">Duração Total (Minutos)</label>
                <input
                  type="number"
                  value={totalDuration}
                  onChange={(e) => setTotalDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg py-2 px-3 text-sm font-mono focus:outline-none focus:border-cyan-500"
                  min="0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-mono block">Rounds Executados</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => incrementRound(-1)}
                    className="bg-slate-900 border border-slate-850 text-slate-300 p-2 rounded-l-lg hover:bg-slate-800 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center bg-slate-950 border-y border-slate-850 py-1.5 text-sm font-bold font-mono text-slate-200">
                    {rounds} Rx
                  </div>
                  <button
                    type="button"
                    onClick={() => incrementRound(1)}
                    className="bg-slate-900 border border-slate-850 text-slate-300 p-2 rounded-r-lg hover:bg-slate-800 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-mono block">Tempo de Sparring (min)</label>
                <select
                  value={roundDuration}
                  onChange={(e) => setRoundDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg py-2 px-3 text-sm font-mono focus:outline-none focus:border-cyan-500"
                >
                  {[3, 4, 5, 6, 7, 8, 10, 12, 15].map(v => (
                    <option key={v} value={v}>{v} min por round</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-mono block">Intervalo / Descanso (min)</label>
                <select
                  value={restDuration}
                  onChange={(e) => setRestDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg py-2 px-3 text-sm font-mono focus:outline-none focus:border-cyan-500"
                >
                  {[0, 0.5, 1, 1.5, 2].map(v => (
                    <option key={v} value={v}>{v === 0 ? 'Sem descanso' : `${v} min`}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Star ratings: Cardio and Force */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Cardio response (stars) */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                <span className="text-xs text-slate-400 font-mono block">Cardio / Condicionamento:</span>
                <div className="flex gap-2.5 items-center mt-1">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const value = idx + 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCardio(value)}
                        className={`text-xl transition-all ${
                          value <= cardio ? 'text-amber-500 scale-110' : 'text-slate-800 hover:text-slate-700'
                        }`}
                      >
                        ★
                      </button>
                    );
                  })}
                  <span className="text-xs text-slate-500 font-mono font-bold ml-1">
                    {cardio === 5 ? 'Excelente' : cardio === 4 ? 'Resistente' : cardio === 3 ? 'Regular' : cardio === 2 ? 'Cansado' : 'Esgotado'}
                  </span>
                </div>
              </div>

              {/* Force effort rating (fire) */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                <span className="text-xs text-slate-400 font-mono block">Intensidade / Output de Força:</span>
                <div className="flex gap-2.5 items-center mt-1">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const value = idx + 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setIntensity(value)}
                        className={`text-lg transition-all ${
                          value <= intensity ? 'filter grayscale-0 scale-115' : 'filter grayscale opacity-30 hover:opacity-60'
                        }`}
                      >
                        🔥
                      </button>
                    );
                  })}
                  <span className="text-xs text-slate-500 font-mono font-bold ml-1">
                    Nível {intensity} de 5
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Instructors & Academies presets configurations fields */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Award className="w-4 h-4 text-purple-400" />
              <h3 className="font-display font-semibold text-sm text-slate-200">Instrutor e Local de Treino</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Instructor select list */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-400 font-mono">Doutrina / Instrutor:</label>
                  <button 
                    type="button" 
                    onClick={() => setShowAddInst(!showAddInst)}
                    className="text-[10px] text-purple-400 hover:underline"
                  >
                    + Criar Novo
                  </button>
                </div>
                
                {showAddInst ? (
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Nome do Mestre"
                      value={tempInstructor}
                      onChange={(e) => setTempInstructor(e.target.value)}
                      className="bg-slate-900 text-slate-200 border border-slate-800 text-xs px-2 py-1 rounded-md flex-1"
                    />
                    <button 
                      type="button"
                      onClick={handleAddInstructorLocal}
                      className="bg-purple-900 text-slate-100 px-2.5 py-1 rounded text-xs"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <select
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)}
                    className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg py-2 px-3 text-xs"
                  >
                    <option value="">Sem instrutor vinculado</option>
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Academy select list */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-400 font-mono">Quartel General / Academia:</label>
                  <button 
                    type="button" 
                    onClick={() => setShowAddAcad(!showAddAcad)}
                    className="text-[10px] text-purple-400 hover:underline"
                  >
                    + Criar Nova
                  </button>
                </div>

                {showAddAcad ? (
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Nome da Academia"
                      value={tempAcademy}
                      onChange={(e) => setTempAcademy(e.target.value)}
                      className="bg-slate-900 text-slate-200 border border-slate-800 text-xs px-2 py-1"
                    />
                    <button 
                      type="button"
                      onClick={handleAddAcademyLocal}
                      className="bg-purple-900 text-slate-100 px-2.5 py-1 rounded text-xs"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <select
                    value={academyId}
                    onChange={(e) => setAcademyId(e.target.value)}
                    className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg py-2 px-3 text-xs"
                  >
                    <option value="">Sem academia vinculada</option>
                    {academies.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Combat Telemetry & Autopsy (Pedagogical Loop) */}
        <div className="space-y-6">
          
          {/* Section: Combat Events Counter (SNAPPY MOBILE/TABLET COMPONENT) */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="font-display font-semibold text-sm text-slate-200">Controle Técnico de Combate (Rolas)</h3>
              </div>
              
              {isQuick && (
                <span className="text-[10px] bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-800">Moções de Baixa Latência</span>
              )}
            </div>

            {isQuick ? (
              <div className="space-y-4">
                <label className="text-xs text-slate-500 block">Esquemas rápidos de botões para preenchimento de Finalização vs. Sacrifícios dadas:</label>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  
                  {/* Quick Submissions */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900 space-y-2">
                    <span className="text-xs text-slate-200 uppercase block font-mono">Finalizados</span>
                    <div className="flex justify-center items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => handleStatChange('submissions', -1)}
                        className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-300"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold font-mono text-emerald-400">{combatStats.submissions}</span>
                      <button 
                        type="button"
                        onClick={() => handleStatChange('submissions', 1)}
                        className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Quick Taps Given */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-900 space-y-2">
                    <span className="text-xs text-slate-200 uppercase block font-mono">Batidas (Taps)</span>
                    <div className="flex justify-center items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => handleStatChange('taps', -1)}
                        className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-300"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold font-mono text-rose-400">{combatStats.taps}</span>
                      <button 
                        type="button"
                        onClick={() => handleStatChange('taps', 1)}
                        className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>

                {/* Quick Presets Templates */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Preenchimento Granular de Sparring (Equivalências rápidas):</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleQuickStatFill(3, 0)} className="bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 px-2 py-1 rounded">3 Subs / 0 Taps</button>
                    <button type="button" onClick={() => handleQuickStatFill(4, 2)} className="bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 px-2 py-1 rounded">4 Subs / 2 Taps</button>
                    <button type="button" onClick={() => handleQuickStatFill(1, 1)} className="bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 px-2 py-1 rounded">1 Sub / 1 Tap</button>
                    <button type="button" onClick={() => handleQuickStatFill(0, 0)} className="bg-slate-900 hover:bg-slate-800 text-[10px] text-rose-400 px-2 py-1 rounded">Zerar Placar</button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">Atribua todas as frações de ocorrências de luta ocorridos no tatame para calibrar com perfeição o dashboard de dominância.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Detailed metrics elements mapping */}
                  {([
                    { key: 'submissions', label: '🥋 Finalizações Aplicadas', color: 'text-emerald-400' },
                    { key: 'taps', label: '💀 Batidas Dadas (Taps)', color: 'text-rose-400' },
                    { key: 'escapes', label: '🏃 Escapadas de Sufoco', color: 'text-cyan-400' },
                    { key: 'sweeps', label: '🔄 Raspagens Realizadas', color: 'text-amber-400' },
                    { key: 'takedowns', label: '🤼 Quedas Aplicadas', color: 'text-purple-400' },
                    { key: 'passes', label: '🛡️ Passagens de Guarda', color: 'text-blue-400' },
                  ] as { key: keyof CombatStats, label: string, color: string }[]).map((st) => (
                    <div key={st.key} className="bg-slate-905 p-3 rounded-xl border border-slate-900 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-300 font-medium block">{st.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatChange(st.key, -1)}
                          className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className={`text-sm font-bold font-mono w-6 text-center ${st.color}`}>
                          {combatStats[st.key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStatChange(st.key, 1)}
                          className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* Dynamic detailed technique & situation entries block */}
            {!isQuick && combatEvents.length > 0 && (
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <BookmarkPlus className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-display font-semibold text-sm text-slate-200">Detalhamento das Ocorrências ({combatEvents.length})</h3>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {combatEvents.map((event, index) => {
                    const labelMap = {
                      submission: '🥋 Finalização Aplicada',
                      tap: '💀 Batida Sofrida (Tap)',
                      escape: '🏃 Escapada de Sufoco',
                      sweep: '🔄 Raspagem Realizada',
                      takedown: '🤼 Queda Aplicada',
                      pass: '🛡️ Passagem de Guarda'
                    };
                    const colorMap = {
                      submission: 'border-emerald-950 bg-emerald-950/20 text-emerald-400',
                      tap: 'border-rose-950 bg-rose-950/20 text-rose-400',
                      escape: 'border-cyan-950 bg-cyan-950/20 text-cyan-400',
                      sweep: 'border-amber-950 bg-amber-950/20 text-amber-400',
                      takedown: 'border-purple-950 bg-purple-950/20 text-purple-400',
                      pass: 'border-blue-950 bg-blue-950/20 text-blue-400'
                    };

                    const typeCount = combatEvents.slice(0, index + 1).filter(e => e.type === event.type).length;

                    return (
                      <div key={event.id} className={`p-4 rounded-xl border ${colorMap[event.type]} space-y-3`}>
                        <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                          <span className="text-xs font-bold font-mono uppercase tracking-wider">
                            {labelMap[event.type]} #{typeCount}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-mono block">Qual técnica específica foi executada?</label>
                            <input 
                              type="text"
                              value={event.technique}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCombatEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, technique: val } : ev));
                              }}
                              placeholder="Ex: Armlock, Ezequiel, Raspagem de Gancho, Baiana"
                              className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-md py-1.5 px-3 focus:outline-none focus:border-purple-500 font-sans"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-mono block">Em qual situação ou posição ocorreu?</label>
                            <input 
                              type="text"
                              value={event.situation}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCombatEvents(prev => prev.map(ev => ev.id === event.id ? { ...ev, situation: val } : ev));
                              }}
                              placeholder="Ex: Guarda Fechada, Cem Quilos, Meia Guarda"
                              className="w-full bg-slate-900 text-slate-100 border border-slate-800 rounded-md py-1.5 px-3 focus:outline-none focus:border-purple-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section: Pedagogical Feedback / Autopsy (Only visible in Detailed view) */}
          {!isQuick && (
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <BookmarkPlus className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-semibold text-sm text-slate-200">Feedback Loop Pedagógico</h3>
              </div>

              <div className="space-y-4">
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-400 font-mono">O que correu bem no treino hoje? (Pontos Fortes):</label>
                    <span className="text-[10px] text-slate-500">Acelera autoanálise</span>
                  </div>
                  <textarea
                    value={wentWell}
                    onChange={(e) => setWentWell(e.target.value)}
                    rows={2}
                    placeholder="Ex: Peguei de bicho nas quedas, finalizei no armlock da guarda fechada..."
                    className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg p-3 text-xs leading-relaxed focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-400 font-mono">O que precisa ser urgentemente melhorado?:</label>
                    <span className="text-[10px] text-slate-500">Conserta falhas cegas</span>
                  </div>
                  <textarea
                    value={needsImprovement}
                    onChange={(e) => setNeedsImprovement(e.target.value)}
                    rows={2}
                    placeholder="Ex: Fiquei sem gás no final, estava telegrafando a chave de braço na guarda fechada, cedi as costas..."
                    className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg p-3 text-xs leading-relaxed focus:outline-none focus:border-rose-500 font-sans"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Core Submit trigger box */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Sua dedicação alimenta a evolução técnica.</span>
            </div>
            
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-sm font-bold py-2.5 px-6 rounded-lg transition-all shadow-md cursor-pointer hover:shadow-emerald-500/10 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Gravar Sessão</span>
            </button>
          </div>

        </div>

      </div>

    </form>
  );
}
