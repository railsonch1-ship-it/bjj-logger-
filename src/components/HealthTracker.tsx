import React, { useState } from 'react';
import { HealthStatus, Injury } from '../types';
import { 
  Heart, 
  Activity, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Flame, 
  Calendar,
  AlertOctagon,
  Dumbbell
} from 'lucide-react';

interface HealthTrackerProps {
  healthStatus: HealthStatus;
  onUpdateHealth: (health: HealthStatus) => void;
}

export default function HealthTracker({ healthStatus, onUpdateHealth }: HealthTrackerProps) {
  const { injuries, isRecoveryTimeOff } = healthStatus;

  // Add temp variables
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');

  const handleToggleRecovery = () => {
    onUpdateHealth({
      ...healthStatus,
      isRecoveryTimeOff: !isRecoveryTimeOff
    });
  };

  const handleAddInjury = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const newInjury: Injury = {
      id: `inj-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: desc.trim(),
      severity
    };

    onUpdateHealth({
      isRecoveryTimeOff,
      injuries: [newInjury, ...injuries]
    });

    setDesc('');
    setSeverity('mild');
  };

  const handleDeleteInjury = (id: string) => {
    onUpdateHealth({
      isRecoveryTimeOff,
      injuries: injuries.filter(inj => inj.id !== id)
    });
  };

  return (
    <div className="space-y-6">

      {/* Main Header / Title Intro */}
      <div className="bg-slate-950 border border-slate-900 duration-150 p-5 rounded-xl space-y-0.5">
        <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-400" />
          <span>Gestão de Saúde, Lesões e Recuperação (Carga Crítica)</span>
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          Monitore o desgaste físico do corpo para garantir longevidade competitiva. O Jiu-Jitsu duro exige cuidado responsável das articulações.
        </p>
      </div>

      {/* Primary Recovery TIME OFF Toggle (Crucial Requirement) */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-sm text-slate-200">Decisão Crucial: Vai tirar uma folga para se recuperar de lesões?</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Nossa heurística inteligente congela a progressão de prazos e metas do módulo de Especialização ativo quando você está em reabilitação médica, evitando sentimentos de culpa técnica desnecessária.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono font-bold ${isRecoveryTimeOff ? 'text-amber-400' : 'text-slate-500'}`}>
              {isRecoveryTimeOff ? 'FOLGA ATIVA / CONGELADO' : 'TREINOS INTEGRALMENTE ATIVOS'}
            </span>
            
            <button
              onClick={handleToggleRecovery}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isRecoveryTimeOff ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                  isRecoveryTimeOff ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dynamic Warning Alert status */}
        {isRecoveryTimeOff ? (
          <div id="status-recovery-banner" className="bg-amber-950/20 border border-amber-800 p-4 rounded-xl flex items-start gap-3 text-amber-300">
            <AlertOctagon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 animate-pulse" />
            <div className="space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.1 inline-block rounded md:mb-1">
                Modo Fisioterapia e Reabilitação Ativado
              </span>
              <p className="text-slate-200 font-sans leading-relaxed">
                As metas técnicas de foco em 30, 60 ou 90 dias foram congeladas para assegurar a sua integridade fisiológica. Suas estatísticas de volumetria no dashboard não serão marcadas com atraso neste período. Dedique-se à reabilitação física, gelo local, nutrição e exames médicos!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-900 p-4 rounded-xl flex items-start gap-3 text-emerald-400">
            <Activity className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1 text-xs text-slate-300">
              <span className="font-bold text-slate-200 block">Corpo Saudável / Pronto para Sparring</span>
              <p className="font-sans leading-relaxed">
                Você está com o status corporal ativo. Lembre-se de tapar rápido antes do estalo e aquecer as articulações perfeitamente antes de carregar o peso do oponente por cima.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Form: Log active injury */}
        <div className="lg:col-span-1 bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Registrar Ocorrência de Lesão</span>
          </h3>

          <form onSubmit={handleAddInjury} className="space-y-4 text-xs font-sans">
            
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono block">O que aconteceu? (Descrição do Incidente):</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="Ex: Pegada no joelho estalou ao sofrer queda, sinto dor no menisco externo..."
                className="w-full bg-slate-900 text-slate-150 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono block">Classificação de Gravidade:</label>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                {([
                  { key: 'mild', label: '🟢 Leve', desc: 'Permite rolar de leve' },
                  { key: 'moderate', label: '🟡 Moderada', desc: 'Evitar Sparring' },
                  { key: 'severe', label: '🔴 Grave', desc: 'Parada Bruta' }
                ] as { key: 'mild' | 'moderate' | 'severe', label: string, desc: string }[]).map((sev) => (
                  <button
                    key={sev.key}
                    type="button"
                    onClick={() => setSeverity(sev.key)}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 font-bold transition-all ${
                      severity === sev.key
                        ? 'bg-rose-950/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{sev.label}</span>
                    <span className="text-[8px] text-slate-500 font-normal truncate block w-full">{sev.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold py-2 rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Registrar Lesão Corporais</span>
            </button>

          </form>
        </div>

        {/* Right Column List: Historical Active Injuries */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <span>🗄️ Histórico de Lesões Cadastradas</span>
          </h3>

          <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-900">
            {injuries.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-1">
                <Heart className="w-8 h-8 text-slate-600 mx-auto" strokeWidth={1} />
                <p className="text-sm">Parabéns. Nenhum registro de incidentes físicos anotados!</p>
              </div>
            ) : (
              injuries.map((inj) => {
                const badgeColor = inj.severity === 'severe' 
                  ? 'bg-rose-950 text-rose-300 border-rose-900' 
                  : inj.severity === 'moderate' 
                    ? 'bg-amber-950 text-amber-300 border-amber-900' 
                    : 'bg-emerald-950 text-emerald-300 border-emerald-900';

                const gravityLabel = inj.severity === 'severe' 
                  ? 'Grave / Parada' 
                  : inj.severity === 'moderate' 
                    ? 'Moderada / Cuidado' 
                    : 'Leve / Desconforto';

                return (
                  <div key={inj.id} className="p-4 flex gap-4 items-start justify-between hover:bg-slate-900/10 transition-all">
                    
                    <div className="space-y-1.5 text-left text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider border ${badgeColor}`}>
                          {gravityLabel}
                        </span>
                        
                        <span className="text-slate-500 font-mono">
                          {new Date(inj.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <p className="text-slate-300 leading-relaxed font-sans font-medium">
                        {inj.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteInjury(inj.id)}
                      className="text-slate-600 hover:text-rose-400 p-1.5 rounded hover:bg-slate-900 transition-all"
                      title="Excluir Ocorrência"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                );
              })
            )}
          </div>

          {/* Quick rehab tips */}
          <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-xl flex items-start gap-3 text-slate-400 text-xs leading-relaxed">
            <Dumbbell className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-slate-300 font-bold font-display block">Aviso Fisioterapêutico Geral:</span>
              <p className="font-sans text-[11px]">
                Dores nas costas ou articulações que persistam por mais de 10 dias consecutivos exigem ressonância médica. Não treine debilitador sob o efeito de anti-inflamatórios pesados: mascarar a dor ativa destrói os tecidos conectivos.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
