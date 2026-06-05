import { useState } from 'react';
import { GamePlan, BJJIdentity, TacticalStyle, BJJArchetype, ConditionalRule, CriticalEscape, GamePlanTechnique } from '../types';
import { 
  Sword, 
  Map, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Save, 
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

interface GamePlanBuilderProps {
  gamePlan: GamePlan;
  onUpdateGamePlan: (gp: GamePlan) => void;
}

export default function GamePlanBuilder({ gamePlan, onUpdateGamePlan }: GamePlanBuilderProps) {
  // Wizard active step
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: Identity & Style states
  const [identity, setIdentity] = useState<BJJIdentity>(gamePlan.identity);
  const [style, setStyle] = useState<TacticalStyle>(gamePlan.style);
  const [archetype, setArchetype] = useState<BJJArchetype>(gamePlan.archetype);

  // STEP 2: Primary Techniques Arsenal
  const [techniques, setTechniques] = useState<GamePlanTechnique[]>(() => {
    return gamePlan.techniques || [
      { id: 'tech-1', name: 'Raspagem Balão de Meia-Guarda', position: 'guard', description: 'Usa a esgrima profunda e desequilíbrio na canela para emborcar e capotar o oponente por cima.' },
      { id: 'tech-2', name: 'Passagem Toureada Lateral', position: 'pass', description: 'Tirar os apoios da calça do adversário e contornar girando em explosão para o controle lateral.' },
      { id: 'tech-3', name: 'Queda Single Leg para Double', position: 'standup', description: 'Simula o avanço na perna única, faz a transição de pegada rápida cortando o quadril para derrubar.' }
    ];
  });

  // STEP 3: Logic Rules
  const [rules, setRules] = useState<ConditionalRule[]>(gamePlan.rules);

  // STEP 4: Escapes & Competition
  const [criticalEscapes, setCriticalEscapes] = useState<CriticalEscape[]>(gamePlan.criticalEscapes);
  const [mentalReminders, setMentalReminders] = useState<string[]>(gamePlan.mentalReminders);
  const [compName, setCompName] = useState(gamePlan.competitionName);
  const [compDate, setCompDate] = useState(gamePlan.competitionDate ? gamePlan.competitionDate.split('T')[0] : '');

  // Add technique temp variables
  const [tempTechName, setTempTechName] = useState('');
  const [tempTechPosition, setTempTechPosition] = useState<'guard' | 'pass' | 'standup' | 'other'>('guard');
  const [tempTechDesc, setTempTechDesc] = useState('');

  // Add rule temp variables
  const [tempTrigger, setTempTrigger] = useState('');
  const [tempRuleType, setTempRuleType] = useState<'technique' | 'custom'>('technique');
  const [selectedTechId, setSelectedTechId] = useState('');
  const [tempCustomReaction, setTempCustomReaction] = useState('');

  // Add escape temp variables
  const [tempPos, setTempPos] = useState('');
  const [tempPlan, setTempPlan] = useState('');

  // Add reminder temp variable
  const [tempReminder, setTempReminder] = useState('');

  // Save utility
  const saveState = (updatedTechs?: GamePlanTechnique[], updatedRules?: ConditionalRule[], updatedEscapes?: CriticalEscape[], updatedReminders?: string[], newCompName?: string, newCompDate?: string) => {
    onUpdateGamePlan({
      identity,
      style,
      archetype,
      techniques: updatedTechs || techniques,
      rules: updatedRules || rules,
      criticalEscapes: updatedEscapes || criticalEscapes,
      mentalReminders: updatedReminders || mentalReminders,
      competitionName: newCompName !== undefined ? newCompName : compName,
      competitionDate: newCompDate !== undefined ? (newCompDate ? new Date(newCompDate).toISOString() : '') : (compDate ? new Date(compDate).toISOString() : '')
    });
  };

  // --- ACTIONS HANDLERS ---
  
  // Skip / Skip step 1
  const handleSkipStep1 = () => {
    setCurrentStep(2);
  };

  // Step 2 Technique CRUD
  const handleAddTechnique = () => {
    if (!tempTechName.trim()) return;
    const newTech: GamePlanTechnique = {
      id: `tech-${Date.now()}`,
      name: tempTechName.trim(),
      position: tempTechPosition,
      description: tempTechDesc.trim() || undefined
    };
    const updated = [...techniques, newTech];
    setTechniques(updated);
    setTempTechName('');
    setTempTechDesc('');
    saveState(updated);
  };

  const handleDeleteTechnique = (id: string) => {
    const updated = techniques.filter(t => t.id !== id);
    setTechniques(updated);
    saveState(updated);
  };

  // Step 3 Rules addition (Connecting branches with techniques)
  const handleAddRule = () => {
    if (!tempTrigger.trim()) return;
    
    let reactionText = '';
    if (tempRuleType === 'technique') {
      const foundTech = techniques.find(t => t.id === selectedTechId);
      if (foundTech) {
        reactionText = `Aplicar ${foundTech.name} (${foundTech.position === 'guard' ? 'Guarda' : foundTech.position === 'pass' ? 'Passagem' : foundTech.position === 'standup' ? 'Em Pé' : 'Transição'})`;
      } else {
        reactionText = tempCustomReaction.trim();
      }
    } else {
      reactionText = tempCustomReaction.trim();
    }

    if (!reactionText) return;

    const newRule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      trigger: tempTrigger.trim(),
      technique: reactionText
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    setTempTrigger('');
    setTempCustomReaction('');
    saveState(techniques, updatedRules);
  };

  const handleDeleteRule = (id: string) => {
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    saveState(techniques, updated);
  };

  // Step 4 Escape CRUD
  const handleAddEscape = () => {
    if (!tempPos.trim() || !tempPlan.trim()) return;
    const newEsc: CriticalEscape = {
      id: `esc-${Date.now()}`,
      position: tempPos.trim(),
      plan: tempPlan.trim()
    };
    const updated = [...criticalEscapes, newEsc];
    setCriticalEscapes(updated);
    setTempPos('');
    setTempPlan('');
    saveState(techniques, rules, updated);
  };

  const handleDeleteEscape = (id: string) => {
    const updated = criticalEscapes.filter(e => e.id !== id);
    setCriticalEscapes(updated);
    saveState(techniques, rules, updated);
  };

  // Reminders
  const handleAddReminder = () => {
    if (!tempReminder.trim()) return;
    const updated = [...mentalReminders, tempReminder.trim()];
    setMentalReminders(updated);
    setTempReminder('');
    saveState(techniques, rules, criticalEscapes, updated);
  };

  const handleDeleteReminder = (index: number) => {
    const updated = mentalReminders.filter((_, i) => i !== index);
    setMentalReminders(updated);
    saveState(techniques, rules, criticalEscapes, updated);
  };

  const getCompCountdown = () => {
    if (!compDate) return null;
    const target = new Date(compDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

  const countdown = getCompCountdown();

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
            <Map className="w-5 h-5 text-orange-400" />
            <span>Fluxo de Estruturação Tática: Game Plan Ativo</span>
          </h2>
          <p className="text-xs text-slate-400">
            Crie, ramifique e teste seu sistema de lutas passo-a-passo para consolidar suas conexões sem indecisão.
          </p>
        </div>

        <button
          onClick={() => {
            saveState();
            alert('Configurações do Game Plan salvas no ecossistema local!');
          }}
          className="bg-orange-500 hover:bg-orange-600 text-slate-950 hover:shadow-lg hover:shadow-orange-500/10 transition-all font-bold rounded-lg px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Plano Tático</span>
        </button>
      </div>

      {/* Progress Steps Indicators */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { step: 1, label: '1. Estilo & Identidade', badge: 'Opcional', icon: Sword },
            { step: 2, label: '2. Arsenal de Técnicas', badge: 'Base', icon: BookOpen },
            { step: 3, label: '3. Ramificações Ativas', badge: 'Lógica', icon: ChevronRight },
            { step: 4, label: '4. Fugas & Campeonato', badge: 'Foco', icon: Award }
          ].map((item, idx, arr) => {
            const IconComponent = item.icon;
            const isCompleted = currentStep > item.step;
            const isActive = currentStep === item.step;
            return (
              <div key={item.step} className="flex-1 flex items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(item.step)}
                  className="flex flex-col items-center gap-1 text-center font-mono focus:outline-none flex-1 group"
                >
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-orange-500 border-orange-500 text-slate-950 shadow-md font-bold' 
                      : isCompleted
                        ? 'bg-orange-950/40 border-orange-600 text-orange-400 font-bold'
                        : 'bg-slate-900 border-slate-850 text-slate-500 group-hover:border-slate-700'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:inline ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono">
                    {item.badge}
                  </span>
                </button>
                {idx < arr.length - 1 && (
                  <div className={`h-0.5 flex-1 hidden md:block ${currentStep > item.step ? 'bg-orange-850' : 'bg-slate-900'}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Profiling and Styles (Optional with Pular Option) */}
      {currentStep === 1 && (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-900 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-orange-400 font-mono font-bold uppercase block">Etapa opcional</span>
              <h3 className="text-sm font-semibold text-slate-200">Definições Estilísticas e Arquétipo</h3>
            </div>
            
            <button
              type="button"
              onClick={handleSkipStep1}
              className="text-xs bg-slate-900 text-slate-350 hover:bg-slate-850 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-800 transition-all font-mono"
            >
              Pular Etapa ➔
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Identity options */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-mono block">1. Identidade Principal (Nicho de posicionamento):</label>
              <div className="space-y-2">
                {([
                  { key: 'guardeiro', label: '🛡️ Guardeiro Dedicado', desc: 'Senta e puxa para colocar o oponente em armadilhas de raspagem por baixo.' },
                  { key: 'passador', label: '⚔️ Passador Técnico', desc: 'Prefere lutar em pé tirando apoios de calçados, amassando ou contornando a guarda.' },
                  { key: 'hibrido', label: '🔄 Híbrido Completo', desc: 'Flui rápido entre quedas, sweeps e passagens conforme o erro do adversário.' }
                ] as { key: BJJIdentity, label: string, desc: string }[]).map((idOpt) => (
                  <button
                    key={idOpt.key}
                    type="button"
                    onClick={() => {
                      setIdentity(idOpt.key);
                      onUpdateGamePlan({ ...gamePlan, identity: idOpt.key });
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all space-y-1 block ${
                      identity === idOpt.key
                        ? 'bg-orange-950/20 border-orange-500 text-orange-300'
                        : 'bg-slate-900/45 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <span className="font-bold block text-slate-200">{idOpt.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">{idOpt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical moves options */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-mono block">2. Estilo de Condução Tática:</label>
              <div className="space-y-2">
                {([
                  { key: 'movimentacao', emoji: '🐆', label: 'Velocidade & Movimentação', desc: 'Transiciona rápido por fora, cansa e abre espaços para finalização rápida.' },
                  { key: 'pressao', emoji: '🐘', label: 'Postura & Pressão', desc: 'Prende quadril, foca na distribuição de peso e esmaga espaço defensivo gradualmente.' },
                  { key: 'contra_ataque', emoji: '🐍', label: 'Contra-golpe & Armadilha', desc: 'Oferece iscas calculadas e contra-ataca explosivamente no momento do erro.' }
                ] as { key: TacticalStyle, emoji: string, label: string, desc: string }[]).map((stOpt) => (
                  <button
                    key={stOpt.key}
                    type="button"
                    onClick={() => {
                      setStyle(stOpt.key);
                      onUpdateGamePlan({ ...gamePlan, style: stOpt.key });
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all space-y-1 block ${
                      style === stOpt.key
                        ? 'bg-orange-950/20 border-orange-500 text-orange-300'
                        : 'bg-slate-900/45 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <span className="font-bold block text-slate-200">{stOpt.emoji} {stOpt.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">{stOpt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty picker */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-mono block">3. Especialidade / Arquétipo Técnico:</label>
              <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 space-y-4">
                <select
                  value={archetype}
                  onChange={(e) => {
                    const newArch = e.target.value as BJJArchetype;
                    setArchetype(newArch);
                    onUpdateGamePlan({ ...gamePlan, archetype: newArch });
                  }}
                  className="w-full bg-slate-900 text-slate-100 border border-slate-850 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="leg_locker">🦵 Leg Locker (Chaves de calcanhar/joelho)</option>
                  <option value="pegador_costas">🎒 Pegador de Costas (Exposição do dorso)</option>
                  <option value="cacador_bracos">💪 Caçador de Braços (Armlocks & Kimura)</option>
                  <option value="guilhotina">💀 Guilhotina e Frontlocks</option>
                  <option value="estrangulador">🥋 Estrangulador de Gola Lapela</option>
                  <option value="raspador">🔄 Raspador Técnico (Guarda aberta/lapelas)</option>
                  <option value="scrambler">🤼 Scrambler (Transições rápidas em pé/chão)</option>
                </select>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
                  <span className="text-orange-400 font-bold block uppercase font-mono text-[9px]">Dica Metodológica:</span>
                  <span>O arquétipo define sua preferência final de finalização ou raspagem. Alinhe suas técnicas chave a este objetivo principal para maximizar resultados.</span>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
            >
              <span>Avançar para Técnicas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Main Technical Arsenal */}
      {currentStep === 2 && (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-5 animate-fadeIn">
          <div className="border-b border-slate-900 pb-3">
            <h3 className="text-sm font-semibold text-slate-200">Etapa 2: Arsenal de Técnicas Ativas do Seu Jogo (Minhas Técnicas)</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Cadastre as técnicas fundamentais de ataque e defesa que você executa com maior eficácia. Elas servirão de base para construir as ligações de combate na Etapa 3.
            </p>
          </div>

          {/* Grid setup */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form to add design technique */}
            <div className="lg:col-span-1 bg-slate-900/30 border border-slate-900 p-4.5 rounded-xl space-y-3">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Adicionar Técnica ao Arsenal:</span>
              
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-mono block">Nome do Movimento / Técnica:</label>
                <input 
                  type="text" 
                  placeholder="Ex: Guarda Laçada"
                  value={tempTechName}
                  onChange={(e) => setTempTechName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-mono block">Posição e Perfil:</label>
                  <select 
                    value={tempTechPosition}
                    onChange={(e) => setTempTechPosition(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-slate-300"
                  >
                    <option value="guard">Por baixo (Guarda)</option>
                    <option value="pass">Por cima (Passagem)</option>
                    <option value="standup">Em pé (Quedas)</option>
                    <option value="other">Outros/Transições</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-mono block">Breve roteiro ou notas de execução:</label>
                <textarea 
                  rows={2}
                  placeholder="Focar na pegada cruzada da manga e controle de bíceps..."
                  value={tempTechDesc}
                  onChange={(e) => setTempTechDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddTechnique}
                className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Técnica no Arsenal</span>
              </button>
            </div>

            {/* List of techniques */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Meu Arsenal Técnico ({techniques.length}):</span>
              
              {techniques.length === 0 ? (
                <div className="bg-slate-900/20 border border-slate-900 border-dashed rounded-xl p-8 text-center text-slate-400">
                  <BookOpen className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs">Nenhuma técnica adicionada. Use o formulário à esquerda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {techniques.map((tech) => (
                    <div key={tech.id} className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl flex justify-between items-start gap-2 relative group hover:border-slate-800 transition-all">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded leading-none uppercase ${
                            tech.position === 'guard' 
                              ? 'bg-blue-950 text-blue-300 border border-blue-900/40' 
                              : tech.position === 'pass' 
                                ? 'bg-purple-950 text-purple-300 border border-purple-900/40' 
                                : 'bg-amber-950 text-amber-300 border border-amber-900/40'
                          }`}>
                            {tech.position === 'guard' ? 'Guarda' : tech.position === 'pass' ? 'Passagem' : tech.position === 'standup' ? 'Em Pé' : 'Outro'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-200">{tech.name}</h4>
                        </div>
                        
                        {tech.description && (
                          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{tech.description}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTechnique(tech.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-950 transition-all"
                        title="Deletar técnica"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-between pt-2 border-t border-slate-900/60">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="bg-slate-900 hover:bg-slate-855 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 border border-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (techniques.length === 0) {
                  alert('Associe ou crie ao menos 1 técnica para conseguir estruturar ramificações lógicas eficientes!');
                }
                setCurrentStep(3);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
            >
              <span>Ir para as Ramificações</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: branched Rules */}
      {currentStep === 3 && (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-5 animate-fadeIn">
          <div className="border-b border-slate-900 pb-3">
            <h3 className="text-sm font-semibold text-slate-200">Etapa 3: Ramificações e Contra-ataques (Matriz Condicional SÉ / ENTÃO)</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Associe eventos táticos do oponente às suas técnicas registradas do arsenal. Isso reduz seu tempo de resposta (delay cognitivo) na hora de lutar.
            </p>
          </div>

          {/* Rules configurations matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Inline creation of rule */}
            <div className="lg:col-span-1 bg-slate-900/30 border border-slate-900 p-4.5 rounded-xl space-y-4">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Adicionar Ramificação Tática (Heurística):</span>
              
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-mono block">SE o Oponente (Gatilho situacional):</label>
                <input 
                  type="text" 
                  placeholder="Ex: Escapar o calcanhar ou posturar na fechada"
                  value={tempTrigger}
                  onChange={(e) => setTempTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 font-mono block">ENTÃO eu reajo com:</label>
                
                <div className="flex gap-4 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input 
                      type="radio" 
                      name="ruleType" 
                      checked={tempRuleType === 'technique'} 
                      onChange={() => setTempRuleType('technique')}
                      className="accent-orange-500"
                    />
                    <span>Uma técnica do Arsenal</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-350">
                    <input 
                      type="radio" 
                      name="ruleType" 
                      checked={tempRuleType === 'custom'} 
                      onChange={() => setTempRuleType('custom')}
                      className="accent-orange-500"
                    />
                    <span>Reação sob medida</span>
                  </label>
                </div>

                {tempRuleType === 'technique' ? (
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-mono block">Selecione do Arsenal Cadastrado:</label>
                    {techniques.length === 0 ? (
                      <div className="text-[11px] text-amber-400 bg-amber-950/20 p-2 rounded border border-amber-900/40">
                        Nenhuma técnica no arsenal! Adicione primeiro no passo 2 ou selecione "Reação sob medida" acima.
                      </div>
                    ) : (
                      <select
                        value={selectedTechId}
                        onChange={(e) => setSelectedTechId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-slate-200"
                      >
                        <option value="">-- Selecione uma Técnica --</option>
                        {techniques.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.position === 'guard' ? 'Guarda' : t.position === 'pass' ? 'Passar' : 'Em pé'})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-mono block">Escreva a reação técnica detalhada:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Pular no estrangulamento triângulo de mão invertido"
                      value={tempCustomReaction}
                      onChange={(e) => setTempCustomReaction(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddRule}
                disabled={!tempTrigger.trim() || (tempRuleType === 'technique' && !selectedTechId) || (tempRuleType === 'custom' && !tempCustomReaction.trim())}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Fixar Nova Condicional</span>
              </button>
            </div>

            {/* Rules logs */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Árvore Ativa de Ramificações ({rules.length}):</span>
              
              {rules.length === 0 ? (
                <div className="bg-slate-900/20 border border-slate-900 border-dashed rounded-xl p-8 text-center text-slate-405">
                  <ChevronRight className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs">Nenhuma ramificação/regra heurística configurada.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rules.map((rule) => {
                    return (
                      <div key={rule.id} className="bg-slate-900/50 border border-slate-900 p-3.5 rounded-xl flex items-start justify-between gap-3 group hover:border-slate-820 transition-all text-xs">
                        <div className="space-y-1.5 flex-1 text-left">
                          <div className="flex gap-2 items-center">
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded leading-none select-none">SE</span>
                            <span className="text-slate-205 font-medium">{rule.trigger}</span>
                          </div>
                          
                          <div className="flex gap-2 items-center border-t border-slate-900/40 pt-1.5">
                            <span className="text-[9px] bg-orange-950 text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded leading-none select-none">ENTÃO</span>
                            <span className="text-orange-200 font-mono font-medium">{rule.technique}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-slate-950 transition-all shrink-0"
                          title="Remover Heurística"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-between pt-2 border-t border-slate-900/60 text-xs">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-slate-900 hover:bg-slate-855 text-slate-300 font-bold px-4 py-2.5 rounded-lg flex items-center gap-1 border border-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar para Arsenal</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
            >
              <span>Ir para Protocolos Finais</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Strategy Consolidation (Escapes, Lembretes and Comp metadata) */}
      {currentStep === 4 && (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-900 pb-3">
            <h3 className="text-sm font-semibold text-slate-200">Etapa 4: Fugas Críticas, Lembretes Mentais & Metas</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Consolide sua resiliência tática definindo protocolos rígidos de emergência e integrando o monitor do campeonato ativo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Critical Escapes */}
            <div className="space-y-4">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-455 animate-pulse" />
                <span>Mapeamento de Escapes por Posição Crítica</span>
              </span>

              <div className="space-y-3">
                {criticalEscapes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Nenhum protocolo cadastrado.</p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {criticalEscapes.map((esc) => (
                      <div key={esc.id} className="bg-slate-900/40 border border-slate-900 p-3.5 rounded-xl space-y-1 relative group">
                        <button 
                          onClick={() => handleDeleteEscape(esc.id)}
                          className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-1 pr-6">
                          <span className="inline-block bg-rose-950 text-rose-300 font-bold border border-rose-900 rounded px-1.5 py-0.5 uppercase tracking-wide text-[9px] font-mono leading-none">
                            🚨 {esc.position}
                          </span>
                          <p className="text-slate-300 leading-relaxed pt-0.5">{esc.plan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Add Form Escape */}
                <div className="p-3 bg-slate-900/35 border border-slate-900 rounded-xl space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Posição Crítica (ex: Cem quilos, Triângulo)" 
                      value={tempPos}
                      onChange={(e) => setTempPos(e.target.value)}
                      className="bg-slate-950 border border-slate-850 p-2 rounded text-slate-200"
                    />
                    <input 
                      type="text" 
                      placeholder="Protocolo mecânico de fuga" 
                      value={tempPlan}
                      onChange={(e) => setTempPlan(e.target.value)}
                      className="bg-slate-950 border border-slate-850 p-2 rounded text-slate-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEscape}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 py-1.5 rounded font-bold hover:text-white hover:bg-slate-850 transition-all text-xs"
                  >
                    + Registrar Fuga Emergencial
                  </button>
                </div>
              </div>
            </div>

            {/* Mental reminders & Competitive calendar */}
            <div className="space-y-6">
              
              {/* Lembretes */}
              <div className="space-y-3">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Conselhos & Lembretes Mentais</span>
                </span>

                <div className="space-y-2 text-xs text-left">
                  {mentalReminders.length === 0 ? (
                    <p className="text-slate-500 italic">Nenhum gatilho mental registrado.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {mentalReminders.map((rem, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-slate-900/30 border border-slate-900 px-3 py-1.5 rounded-lg gap-2 text-slate-300">
                          <span>🧠 {rem}</span>
                          <button 
                            onClick={() => handleDeleteReminder(idx)}
                            className="text-slate-655 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Adicione conselhos... Ex: Manter canela alta de escudo..."
                      value={tempReminder}
                      onChange={(e) => setTempReminder(e.target.value)}
                      className="bg-slate-900 border border-slate-850 p-2 rounded flex-1 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddReminder}
                      className="bg-slate-900 hover:bg-slate-850 text-slate-200 px-3 py-1 rounded border border-slate-800"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* Competition Metadata */}
              <div className="space-y-3 bg-slate-900/20 border border-slate-900 p-4 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Meta Competitiva de Campeonato</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-450 text-[10px] block">Nome do Campeonato:</label>
                    <input 
                      type="text" 
                      value={compName}
                      onChange={(e) => {
                        setCompName(e.target.value);
                        saveState(techniques, rules, criticalEscapes, mentalReminders, e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-450 text-[10px] block">Data do Evento:</label>
                    <input 
                      type="date" 
                      value={compDate}
                      onChange={(e) => {
                        setCompDate(e.target.value);
                        saveState(techniques, rules, criticalEscapes, mentalReminders, compName, e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-slate-100 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {countdown !== null && (
                  <div className="bg-orange-500/10 border border-orange-800/40 p-2.5 rounded-lg text-center mt-2">
                    <p className="text-xs font-bold font-mono text-orange-200">
                      {countdown > 0 ? `⏳ Faltam ${countdown} Dias de Treinos para lutar!` : countdown === 0 ? '🏁 O DIA DO EVENTO É HOJE!' : 'Passado'}
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

          <div className="flex justify-between pt-2 border-t border-slate-900/60">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="bg-slate-900 hover:bg-slate-855 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 border border-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                saveState();
                alert('Toda a estrutura do seu Game Plan foi consolidada de forma segura!');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Concluir e Consolidar</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
