import React, { useState } from 'react';
import { FocusTechnique, Achievement, PlatformType } from '../types';
import { 
  Target, 
  Plus, 
  Check, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  ExternalLink, 
  Flame, 
  PlayCircle,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface FocusModuleProps {
  techniques: FocusTechnique[];
  achievements: Achievement[];
  onAddTechnique: (tech: Omit<FocusTechnique, 'id'>) => void;
  onUpdateReps: (id: string, successful: boolean) => void;
  onDeleteTechnique: (id: string) => void;
  onEditTechnique: (tech: FocusTechnique) => void;
}

export default function FocusModule({
  techniques,
  achievements,
  onAddTechnique,
  onUpdateReps,
  onDeleteTechnique,
  onEditTechnique
}: FocusModuleProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTech, setEditingTech] = useState<FocusTechnique | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newTechName, setNewTechName] = useState('');
  const [newSuccessGoal, setNewSuccessGoal] = useState<number>(20);
  const [newWindowDays, setNewWindowDays] = useState<30 | 60 | 90>(30);
  const [newLink, setNewLink] = useState('');
  const [newPlatform, setNewPlatform] = useState<PlatformType>('youtube');

  // Submit new/edited focus technique
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    if (editingTech) {
      onEditTechnique({
        ...editingTech,
        name: newTechName.trim(),
        successGoal: Number(newSuccessGoal),
        windowDays: newWindowDays,
        tutorialLink: newLink.trim() || undefined,
        tutorialPlatform: newLink.trim() ? newPlatform : undefined
      });
      setEditingTech(null);
    } else {
      onAddTechnique({
        name: newTechName.trim(),
        successGoal: Number(newSuccessGoal),
        successfulReps: 0,
        totalAttempts: 0,
        windowDays: newWindowDays,
        startDate: new Date().toISOString(),
        tutorialLink: newLink.trim() || undefined,
        tutorialPlatform: newLink.trim() ? newPlatform : undefined
      });
    }

    // Reset fields
    setNewTechName('');
    setNewSuccessGoal(20);
    setNewWindowDays(30);
    setNewLink('');
    setNewPlatform('youtube');
    setShowAddForm(false);
  };

  // Helper: Status of technique velocity progression
  const getVelocityStatus = (tech: FocusTechnique) => {
    if (tech.successfulReps >= tech.successGoal) {
      return { label: 'Alcançada! 🎉', style: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' };
    }

    const start = new Date(tech.startDate).getTime();
    const now = new Date().getTime();
    const elapsedDays = Math.max(1, Math.round((now - start) / (24 * 60 * 60 * 1000)));
    const totalDays = tech.windowDays;
    
    const timeElapsedRatio = Math.min(1, elapsedDays / totalDays);
    const expectedProgressProportional = tech.successGoal * timeElapsedRatio;

    if (elapsedDays > totalDays) {
      return { label: 'Prazo Vencido ⚠️', style: 'text-rose-400 bg-rose-950/40 border-rose-900' };
    }

    if (tech.successfulReps < expectedProgressProportional - 2) {
      return { label: 'Atrasado ⏳', style: 'text-amber-400 bg-amber-950/40 border-amber-900 animate-pulse' };
    }

    return { label: 'Em Dia 👍', style: 'text-cyan-400 bg-cyan-950/40 border-cyan-900' };
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 border border-slate-900 p-5 rounded-xl">
        <div className="space-y-0.5">
          <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>Módulo de Especialização: Foco e Maestria Técnica</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Baseado em <strong className="text-emerald-400">Prática Deliberada</strong>. Selecione movimentos críticos e force sua assimilação repetitiva sob pressão.
          </p>
        </div>

        <button
          onClick={() => {
            if (showAddForm) {
              setEditingTech(null);
              setNewTechName('');
              setNewSuccessGoal(20);
              setNewWindowDays(30);
              setNewLink('');
            }
            setShowAddForm(!showAddForm);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/10 transition-all font-semibold rounded-lg px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
          <span>{showAddForm ? 'Cancelar' : 'Fixar Novo Foco'}</span>
        </button>
      </div>

      {/* Slide down add focus technique form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4 animate-fadeIn">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-900">
            {editingTech ? `Editar Projeto: ${editingTech.name}` : 'Configurar Projeto de Maestria Técnica'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-mono block">Nome do Movimento / Técnica:</label>
              <input 
                type="text" 
                placeholder="Ex: Raspagem Dela Riva para Costas" 
                value={newTechName} 
                onChange={(e) => setNewTechName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-mono block">Meta de Execuções Eficazes:</label>
              <input 
                type="number" 
                value={newSuccessGoal} 
                onChange={(e) => setNewSuccessGoal(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                min="1"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-mono block">Janela Temporal Target:</label>
              <select 
                value={newWindowDays} 
                onChange={(e) => setNewWindowDays(Number(e.target.value) as 30 | 60 | 90)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs text-slate-200"
              >
                <option value={30}>30 Dias (Foco Curto)</option>
                <option value={60}>60 Dias (Foco Médio)</option>
                <option value={90}>90 Dias (Ciclo Completo)</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-mono block">Link de Tutorial (Opcional):</label>
              <input 
                type="url" 
                placeholder="https://youtube.com/... ou instragram.com/..." 
                value={newLink} 
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-mono block">Origem do Bookmark:</label>
              <select 
                value={newPlatform} 
                onChange={(e) => setNewPlatform(e.target.value as PlatformType)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs text-slate-200"
              >
                <option value="youtube">YouTube Video</option>
                <option value="instagram">Instagram Reel</option>
                <option value="tiktok">TikTok Video</option>
                <option value="other">Outro Endereço</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs cursor-pointer shadow"
            >
              {editingTech ? 'Salvar Alterações do Foco' : 'Iniciar Projeto e Monitoramento'}
            </button>
          </div>
        </form>
      )}

      {/* Grid: Left column holds Focus Cards List, Right column hold Achievements/Gamification Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Focus Techniques list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
            <span>🚀 Matriz de Rastreabilidade Operacional ({techniques.length})</span>
          </h3>

          {techniques.length === 0 ? (
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-8 text-center text-slate-500 space-y-2">
              <Target className="w-10 h-10 text-slate-700 mx-auto" strokeWidth={1} />
              <p className="text-sm">Nenhuma técnica estipulada para foco ativo.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="text-xs text-emerald-400 underline hover:text-emerald-300"
              >
                Fixar primeiro alvo agora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {techniques.map((tech) => {
                const velocity = getVelocityStatus(tech);
                
                // Calculates success rate (successful / attempts)
                const successRate = tech.totalAttempts > 0 
                  ? Math.round((tech.successfulReps / tech.totalAttempts) * 100) 
                  : 0;

                // Duration calculator
                const startedDate = new Date(tech.startDate);
                const timeDiff = new Date().getTime() - startedDate.getTime();
                const daysElapsed = Math.max(0, Math.round(timeDiff / (24 * 60 * 60 * 1000)));
                const remainingDays = Math.max(0, tech.windowDays - daysElapsed);

                return (
                  <div key={tech.id} className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 relative overflow-hidden">
                    {/* Header info */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${velocity.style}`}>
                          {velocity.label}
                        </span>
                        
                        <h4 className="text-sm font-semibold text-slate-200 font-display">{tech.name}</h4>
                        
                        <p className="text-[11px] text-slate-500 font-mono">
                          Iniciado em {startedDate.toLocaleDateString('pt-BR')} • {remainingDays} dias restantes de {tech.windowDays} dias planejado
                        </p>
                      </div>

                      <div className="flex gap-1.5 shrink-0 items-center">
                        <button 
                          onClick={() => {
                            setEditingTech(tech);
                            setNewTechName(tech.name);
                            setNewSuccessGoal(tech.successGoal);
                            setNewWindowDays(tech.windowDays);
                            setNewLink(tech.tutorialLink || '');
                            setNewPlatform(tech.tutorialPlatform || 'youtube');
                            setShowAddForm(true);
                          }}
                          className="text-slate-400 hover:text-emerald-400 text-xs hover:bg-slate-900 px-2.5 py-1.5 rounded transition-all font-mono font-medium cursor-pointer"
                        >
                          Editar
                        </button>

                        {confirmDeleteId === tech.id ? (
                          <div className="flex items-center gap-1 bg-slate-900 duration-100 border border-slate-800 p-1 rounded animate-fadeIn shrink-0">
                            <span className="text-[9px] text-slate-400 font-mono px-1">Tem certeza?</span>
                            <button 
                              type="button"
                              onClick={() => {
                                onDeleteTechnique(tech.id);
                                setConfirmDeleteId(null);
                              }}
                              className="bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold text-[10px] px-2 py-1 rounded cursor-pointer transition-all"
                            >
                              Sim
                            </button>
                            <button 
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] px-2 py-1 rounded cursor-pointer transition-all"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => setConfirmDeleteId(tech.id)}
                            className="text-slate-600 hover:text-rose-450 text-xs hover:bg-slate-900 px-2.5 py-1.5 rounded transition-all font-mono font-medium cursor-pointer"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
                      
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Eficiência de Prática:</span>
                        <span className="text-slate-200">
                          {tech.successfulReps} acertos / {tech.totalAttempts} total de tentativas
                        </span>
                      </div>

                      {/* Micro Progress Bar */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-emerald-400 rounded-full h-full text-center transition-all duration-500" 
                          style={{ width: `${Math.min(100, (tech.successfulReps / tech.successGoal) * 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>Meta de acertos: <strong className="text-emerald-400">{tech.successGoal}</strong></span>
                        <span>Progresso físico: {Math.round((tech.successfulReps / tech.successGoal) * 100)}%</span>
                      </div>

                    </div>

                    {/* Action controllers buttons & Tutorial triggers */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                      
                      {/* Success Ratio Counter display */}
                      <div className="flex items-center gap-3 bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-900">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">Taxa de Eficácia Sob Pressão:</span>
                          <span className="text-xs font-bold font-mono text-emerald-300">{successRate}% de aproveitamento</span>
                        </div>
                      </div>

                      {/* Snappy increment controllers buttons */}
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Atualizar tentativas:</span>
                        
                        <button
                          onClick={() => onUpdateReps(tech.id, false)}
                          className="bg-slate-900 border border-slate-850 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <span>ø Erro (-1)</span>
                        </button>
                        
                        <button
                          onClick={() => onUpdateReps(tech.id, true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Acerto (+1)</span>
                        </button>
                      </div>

                    </div>

                    {/* Bookmark Display if tutorial link exists */}
                    {tech.tutorialLink && (
                      <div className="mt-2 pt-3 border-t border-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Link de Conteúdo Vinculado:</span>
                          <span className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                            {tech.tutorialPlatform}
                          </span>
                        </div>
                        
                        <a 
                          href={tech.tutorialLink} 
                          target="_blank" 
                          rel="referrer" 
                          referrerPolicy="no-referrer"
                          className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1"
                        >
                          <span>Assistir Tutorial</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right side panel: Achievements (Gamification of BJJ) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
            <Award className="w-4 h-4 text-orange-400" />
            <span>🏅 Conquistas & Medalhas do Guerreiro</span>
          </h3>

          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200">Seu Progresso de Graduação Espiritual</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                No Jiu-Jitsu, nada é dado de graça. Complete os objetivos técnicos e registre sessões periódicas no tatame para desbloquear as medalhas de maestria.
              </p>
            </div>

            <div className="space-y-3.5 divide-y divide-slate-900/60">
              {achievements.map((ach) => {
                const isUnlocked = !!ach.unlockedAt;
                
                return (
                  <div key={ach.id} className={`flex gap-3 pt-3.5 first:pt-0 ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`p-2 rounded-lg border h-10 w-10 flex items-center justify-center shrink-0 ${
                      isUnlocked 
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-500' 
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {ach.iconName === 'Flame' && <Flame className="w-5 h-5" />}
                      {ach.iconName === 'Award' && <Award className="w-5 h-5" />}
                      {ach.iconName === 'ShieldAlert' && <Target className="w-5 h-5" />}
                      {ach.iconName === 'Compass' && <PlayCircle className="w-5 h-5" />}
                      {ach.iconName === 'Zap' && <Flame className="w-5 h-5" />}
                    </div>

                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold font-display text-slate-200">{ach.title}</h5>
                        {isUnlocked && (
                          <span className="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1 py-0.1 outline-amber-800/20 rounded font-mono uppercase tracking-wide">
                            Desbloqueado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight font-sans">{ach.description}</p>
                      
                      {ach.unlockedAt && (
                        <span className="text-[9px] text-slate-500 font-mono block">
                          Conquistado em: {new Date(ach.unlockedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
