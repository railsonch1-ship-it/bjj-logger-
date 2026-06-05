import { useState } from 'react';
import { TrainingLog, Instructor, Academy } from '../types';
import { 
  Trophy, 
  Calendar, 
  Flame, 
  Activity, 
  Sword, 
  Dumbbell, 
  TrendingUp, 
  Eye, 
  Trash2, 
  GitCommit, 
  Crown,
  Clock,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  Legend, 
  Cell 
} from 'recharts';

interface DashboardProps {
  logs: TrainingLog[];
  instructors: Instructor[];
  academies: Academy[];
  onDeleteLog: (id: string) => void;
}

export default function Dashboard({ logs, instructors, academies, onDeleteLog }: DashboardProps) {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [modalityFilter, setModalityFilter] = useState<'all' | 'gi' | 'nogi'>('all');

  // Helpers to fetch names
  const getInstructorName = (id: string) => {
    const inst = instructors.find(i => i.id === id);
    return inst ? inst.name : 'Sem Instrutor';
  };

  const getAcademyName = (id: string) => {
    const acad = academies.find(a => a.id === id);
    return acad ? acad.name : 'Sem Academia';
  };

  // Filtered logs
  const filteredLogs = logs.filter(log => {
    if (modalityFilter === 'all') return true;
    return log.modality === modalityFilter;
  });

  // Streaks and frequency calculations
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    // Simple robust streak algorithm based on training weeks
    const trainingWeeks = new Set<string>();
    logs.forEach(log => {
      const date = new Date(log.date);
      // Get ISO week number approximate helper
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
      const weekNum = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
      trainingWeeks.add(`${date.getFullYear()}-W${weekNum}`);
    });

    return trainingWeeks.size; // Weeks with at least one sparring session
  };

  const totalLogs = filteredLogs.length;
  
  // Total Sparring Stats
  const totalDuration = filteredLogs.reduce((acc, log) => acc + log.totalDuration, 0);
  const totalRounds = filteredLogs.reduce((acc, log) => acc + log.rounds, 0);
  
  // Sparring ratio: (rounds * roundDuration) / totalDuration
  const sparringDuration = filteredLogs.reduce((acc, log) => acc + (log.rounds * log.roundDuration), 0);
  const sparringPercentage = totalDuration > 0 ? Math.min(100, Math.round((sparringDuration / totalDuration) * 100)) : 0;

  // Combat details
  const totalSubs = filteredLogs.reduce((acc, log) => acc + log.combatStats.submissions, 0);
  const totalTaps = filteredLogs.reduce((acc, log) => acc + log.combatStats.taps, 0);
  const totalEscapes = filteredLogs.reduce((acc, log) => acc + log.combatStats.escapes, 0);
  const totalSweeps = filteredLogs.reduce((acc, log) => acc + log.combatStats.sweeps, 0);
  const totalTakedowns = filteredLogs.reduce((acc, log) => acc + log.combatStats.takedowns, 0);
  const totalPasses = filteredLogs.reduce((acc, log) => acc + log.combatStats.passes, 0);

  // Fin/Bat Ratio (Efficiency Indicator)
  const ratioFinBat = totalTaps > 0 ? (totalSubs / totalTaps).toFixed(2) : totalSubs > 0 ? `${totalSubs}.0` : '0.00';

  // Relative proficiency indicator based on ratio and rounds
  const getProficiencyLevel = () => {
    const ratio = totalTaps > 0 ? totalSubs / totalTaps : totalSubs;
    if (totalLogs === 0) return { title: 'Iniciante', color: 'text-slate-400 bg-slate-900/40 border-slate-800' };
    if (ratio >= 2.5 && totalLogs >= 5) return { title: 'Elite Competidor', color: 'text-rose-400 bg-rose-950/40 border-rose-800' };
    if (ratio >= 1.2) return { title: 'Avançado / Guardeiro Ofensivo', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' };
    if (ratio >= 0.7) return { title: 'Constante / Técnico Consolidado', color: 'text-blue-400 bg-blue-950/40 border-blue-800' };
    return { title: 'Firmeza Defensiva', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800' };
  };

  const badgeProps = getProficiencyLevel();

  // Weekly calendar checker (Monday to Sunday check for current week)
  const getWeekDaysStatus = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sun, 1 is Mon...
    const monday = new Date();
    // Set to Monday of current week
    monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    monday.setHours(0,0,0,0);

    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const daysData = weekDays.map((name, index) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + index);
      
      // Check if any training exists on this calendar date (local format matching)
      const trained = logs.some(log => {
        const logDate = new Date(log.date);
        return logDate.getFullYear() === dayDate.getFullYear() &&
               logDate.getMonth() === dayDate.getMonth() &&
               logDate.getDate() === dayDate.getDate();
      });

      return {
        name,
        date: dayDate.getDate(),
        trained,
        isToday: dayDate.getDate() === now.getDate() && dayDate.getMonth() === now.getMonth()
      };
    });

    return daysData;
  };

  const weekDayStatuses = getWeekDaysStatus();

  // Dynamic 30-day volume calculation
  const generateLast30DaysData = () => {
    const data = [];
    const nowRef = new Date();
    nowRef.setHours(23, 59, 59, 999);
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(nowRef);
      d.setDate(nowRef.getDate() - i);
      
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getDate() === d.getDate() &&
               logDate.getMonth() === d.getMonth() &&
               logDate.getFullYear() === d.getFullYear();
      });
      
      const duration = dayLogs.reduce((sum, log) => sum + log.totalDuration, 0);
      const rounds = dayLogs.reduce((sum, log) => sum + log.rounds, 0);
      const formattedDay = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
      
      data.push({
        name: formattedDay,
        'Volume (Minutos)': duration,
        'Rounds': rounds,
        'Quantidade': dayLogs.length
      });
    }
    return data;
  };

  const last30DaysData = generateLast30DaysData();

  return (
    <div className="space-y-6">
      
      {/* Upper Cards Rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Streak Counter */}
        <div id="stat-streak" className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex items-center justify-between shadow-md relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-display">Semanas Ativo</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-emerald-400">{calculateStreak()}</span>
              <span className="text-xs text-slate-500">streak seq.</span>
            </div>
            <p className="text-xs text-slate-500">Mantenha a consistência do escudo</p>
          </div>
          <div className="bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/30">
            <Flame className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -mr-6 -mt-6"></div>
        </div>

        {/* Sparring Ratio Card */}
        <div id="stat-ratio" className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex items-center justify-between shadow-md relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-display">Dominância (Fin/Bat)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-orange-400">{ratioFinBat}</span>
              <span className="text-xs text-slate-500">{totalSubs} F / {totalTaps} B</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block w-2- h-2 rounded bg-orange-500"></span>
              <span className="text-xs text-slate-400 font-mono">Eficiência Ofensiva</span>
            </div>
          </div>
          <div className="bg-orange-500/10 p-2.5 rounded-lg border border-orange-500/20">
            <Trophy className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        {/* Total Training Hours */}
        <div id="stat-hours" className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex items-center justify-between shadow-md relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-display">Volume no Tatame</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-cyan-400">
                {Math.floor(totalDuration / 60)}h <span className="text-xl">{totalDuration % 60}m</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">Em {totalLogs} treinos registrados</p>
          </div>
          <div className="bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        {/* Density & Rolling percentage */}
        <div id="stat-density" className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex items-center justify-between shadow-md relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-display">Rolas vs Aula</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-purple-400">{sparringPercentage}%</span>
              <span className="text-xs text-slate-500">combate</span>
            </div>
            <p className="text-xs text-slate-500">{totalRounds} rounds totais</p>
          </div>
          <div className="bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20">
            <Sword className="w-6 h-6 text-purple-400" />
          </div>
        </div>

      </div>

      {/* Week Calendar Tracker and Core Status Badge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Weekly Consistency Tracker */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 lg:col-span-2 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm text-slate-200">Consistência Semanal (Calendário de Treinos)</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Maio/Junho 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDayStatuses.map((day, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg border text-center transition-all ${
                  day.trained 
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400 font-medium' 
                    : day.isToday 
                      ? 'bg-slate-900 border-slate-700 text-slate-200 font-semibold' 
                      : 'bg-slate-950 border-slate-900/60 text-slate-500'
                }`}
              >
                <div className="text-[10px] uppercase font-mono tracking-wider opacity-80 mb-1">{day.name}</div>
                <div className="text-lg font-bold font-mono">{day.date}</div>
                <div className="mt-1 flex justify-center">
                  {day.trained ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-500/60"></span>
              <span>Dia Treinado</span>
              <span className="inline-block w-2.5 h-2.5 rounded bg-slate-900 border border-slate-700 ml-2"></span>
              <span>Hoje</span>
            </div>
            <span>Construção de Hábito Ativo</span>
          </div>
        </div>

        {/* Right Card: Technical Proficiencies */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-200">
              <Crown className="w-4 h-4 text-orange-400" />
              <h3 className="font-display font-semibold text-sm">Índice Técnico Atual</h3>
            </div>
            
            <div className={`p-4 rounded-xl border text-center ${badgeProps.color}`}>
              <span className="block text-xs uppercase tracking-wider font-mono opacity-80 mb-1">Arquétipo Dominante</span>
              <span className="text-base font-bold font-display">{badgeProps.title}</span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Eficiência de Finalização:</span>
                <span className="text-slate-200 font-bold">{totalSubs} aplicadas</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Grau de Absorção de Batidas (Taps):</span>
                <span className="text-slate-200 font-bold">{totalTaps} dadas</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic mt-4 border-t border-slate-900 pt-3">
            *O BJJ Performance Logger calcula seu arquétipo através do feedback loop estatístico de finalizações vs. batidas sofridas.
          </div>
        </div>

      </div>

      {/* SECTION: GRAPH PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* volume do treino nos últimos 30 dias */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 lg:col-span-2 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm text-slate-200">Volume de Treinamento (Últimos 30 dias)</h3>
            </div>
            <span className="text-[10px] uppercase font-mono bg-emerald-950/45 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-bold">
              Minutos de Tatame Acumulados
            </span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last30DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" name="Volume (Minutos)" dataKey="Volume (Minutos)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" name="Rounds" dataKey="Rounds" stroke="#a855f7" strokeWidth={1} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
            <span>*Exibe volume de treinos e rounds diários em escala retroativa.</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Minutos</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Rounds</span>
            </div>
          </div>
        </div>

        {/* Diagnostic analysis chart panel on strengths and weaknesses */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 lg:col-span-3 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-semibold text-sm text-slate-200">Painel Detalhado de Diagnóstico Técnico (Onde Estou Bem vs. Mal)</h3>
              </div>
              <p className="text-xs text-slate-400">Distribuição estatística de eficiência proativa comparada com brechas defensivas</p>
            </div>
            
            <div className="flex gap-2">
              <span className="text-[10px] uppercase font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-bold">
                Ataques Ativos: {totalSubs + totalPasses + totalSweeps + totalTakedowns}
              </span>
              <span className="text-[10px] uppercase font-mono bg-rose-950/40 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded font-bold">
                Defesas/Brechas: {totalTaps + totalEscapes}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Bar Chart Comparison (Col-Span 7) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Mapeamento de Escala de Luta (Placar Absoluto):</span>
              
              <div className="h-64 w-full bg-slate-900/20 p-2 rounded-xl border border-slate-900/50">
                {totalSubs === 0 && totalTaps === 0 && totalEscapes === 0 && totalSweeps === 0 && totalTakedowns === 0 && totalPasses === 0 ? (
                  <div className="text-center text-slate-500 text-xs py-20">
                    <p>Inicie seus registros detalhados para preencher o gráfico de diagnóstico comparativo.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Finalizações 🎯', 'Ações': totalSubs, tipo: 'Ataque', fill: '#10b981' },
                        { name: 'Passagens 🛡️', 'Ações': totalPasses, tipo: 'Ataque', fill: '#3b82f6' },
                        { name: 'Raspagens 🔄', 'Ações': totalSweeps, tipo: 'Ataque', fill: '#f59e0b' },
                        { name: 'Quedas 🤼', 'Ações': totalTakedowns, tipo: 'Ataque', fill: '#8b5cf6' },
                        { name: 'Escapadas 🏃', 'Ações': totalEscapes, tipo: 'Defesa', fill: '#06b6d4' },
                        { name: 'Batidas (Taps) 💀', 'Ações': totalTaps, tipo: 'Brecha', fill: '#ef4444' }
                      ]}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="Ações" radius={[4, 4, 0, 0]}>
                        {[
                          { fill: '#10b981' }, // Submissions
                          { fill: '#3b82f6' }, // Passes
                          { fill: '#f59e0b' }, // Sweeps
                          { fill: '#8b5cf6' }, // Takedowns
                          { fill: '#06b6d4' }, // Escapes
                          { fill: '#ef4444' }  // Taps
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="flex gap-4 items-center justify-center text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-full bg-emerald-500"></span> Ofensivo Dominante</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-full bg-blue-500"></span> Transição/Conexão</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-full bg-red-500"></span> Vulnerabilidades</span>
              </div>
            </div>

            {/* 2. Top Techniques mapped details (Col-Span 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-2">Diagnóstico de Assinatura Técnica:</span>
                
                <div className="space-y-2">
                  {/* Where they stand well */}
                  <div className="bg-emerald-950/15 border border-emerald-900/30 p-3 rounded-lg space-y-1.5">
                    <span className="text-emerald-400 font-bold block text-[10px] uppercase font-mono">🥋 Ofensiva & Domínio (+)</span>
                    {logs.some(l => l.combatEvents && l.combatEvents.some(e => e.type === 'submission' || e.type === 'sweep' || e.type === 'pass')) ? (
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-300">Suas finalizações, raspagens e guardas mais eficientes:</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {(() => {
                            const map: Record<string, number> = {};
                            logs.forEach(l => l.combatEvents?.forEach(e => {
                              if (e.type === 'submission' || e.type === 'sweep' || e.type === 'pass') {
                                map[e.technique] = (map[e.technique] || 0) + 1;
                              }
                            }));
                            return Object.entries(map)
                              .sort((a,b) => b[1] - a[1])
                              .slice(0, 3)
                              .map(([tech, count], i) => (
                                <span key={i} className="text-[10px] font-mono bg-emerald-950/50 border border-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <span>{tech}</span>
                                  <strong className="text-white">x{count}</strong>
                                </span>
                              ));
                          })()}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 leading-normal">Seu arsenal ofensivo ainda não foi registrado em combates detalhados. Use o Registrar Treino.</p>
                    )}
                  </div>

                  {/* Where they stand poorly / Vulnerabilities */}
                  <div className="bg-rose-950/15 border border-rose-900/30 p-3 rounded-lg space-y-1.5">
                    <span className="text-rose-400 font-bold block text-[10px] uppercase font-mono">⚠️ Brechas & Contramedidas (ø)</span>
                    {logs.some(l => l.combatEvents && l.combatEvents.some(e => e.type === 'tap')) ? (
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-300">Posições ou ataques onde você foi pego recentemente:</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {(() => {
                            const map: Record<string, number> = {};
                            logs.forEach(l => l.combatEvents?.forEach(e => {
                              if (e.type === 'tap') {
                                map[e.technique] = (map[e.technique] || 0) + 1;
                              }
                            }));
                            return Object.entries(map)
                              .sort((a,b) => b[1] - a[1])
                              .slice(0, 3)
                              .map(([tech, count], i) => (
                                <span key={i} className="text-[10px] font-mono bg-rose-950/50 border border-rose-900 text-rose-450 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <span>{tech}</span>
                                  <strong className="text-white">x{count}</strong>
                                </span>
                              ));
                          })()}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 leading-normal">Nenhum batida (tap) detalhado em treino registrado ainda. Defesas perfeitas detectadas!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic coach guidance message */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-widest text-amber-500 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Diretriz Corretiva
                </span>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  {totalTaps > totalSubs 
                    ? 'Seu volume de batidas dadas está acima das finalizações aplicadas. Recomenda-se treinar retenções de guarda e vedações de triângulos na meia-guarda.' 
                    : totalPasses < totalSweeps && totalSweeps > 0
                      ? 'Seu jogo por baixo está afiado (raspador), mas você carece de passagens eficientes. Pratique passagens de pressão colada (safari ou legweave).'
                      : 'Equilíbrio tático positivo. Sugere-se continuar focando nos eixos de conexão para manter o oponente sob pressão de transição contínua.'}
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Detail Combat Event Tracker Grid */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <h3 className="font-display font-semibold text-sm text-slate-200">Telemetria de Combate (Estatísticas Acumuladas)</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div id="metric-sub" className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60 text-center space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">Finalizações</span>
            <span className="block text-2xl font-bold font-mono text-emerald-400">{totalSubs}</span>
          </div>
          <div id="metric-taps" className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60 text-center space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">Batidas</span>
            <span className="block text-2xl font-bold font-mono text-rose-400">{totalTaps}</span>
          </div>
          <div id="metric-escapes" className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60 text-center space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">Escapadas</span>
            <span className="block text-2xl font-bold font-mono text-cyan-400">{totalEscapes}</span>
          </div>
          <div id="metric-sweeps" className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60 text-center space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">Raspagens</span>
            <span className="block text-2xl font-bold font-mono text-amber-400">{totalSweeps}</span>
          </div>
          <div id="metric-takedowns" className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60 text-center space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">Quedas</span>
            <span className="block text-2xl font-bold font-mono text-purple-400">{totalTakedowns}</span>
          </div>
          <div id="metric-passes" className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60 text-center space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">Passagens</span>
            <span className="block text-2xl font-bold font-mono text-blue-400">{totalPasses}</span>
          </div>
        </div>
      </div>

      {/* History of Training Logs Section */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl shadow-sm overflow-hidden">
        
        {/* Header and list filters */}
        <div className="p-5 border-b border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-display font-semibold text-slate-200">Histórico de Treinos Registrados</h3>
            <p className="text-xs text-slate-400">Total de {logs.length} sessões registradas no ecossistema</p>
          </div>

          <div className="flex gap-2 bg-slate-900 p-1 rounded-lg self-start">
            <button 
              onClick={() => setModalityFilter('all')}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${modalityFilter === 'all' ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setModalityFilter('gi')}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${modalityFilter === 'gi' ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Kimono (Gi)
            </button>
            <button 
              onClick={() => setModalityFilter('nogi')}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${modalityFilter === 'nogi' ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              No-Gi
            </button>
          </div>
        </div>

        {/* Log list table structure */}
        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-1">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto" strokeWidth={1} />
              <p className="text-sm">Nenhum treino filtrado para visualização.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-900">
              {filteredLogs.map((log) => {
                const isSelected = selectedLogId === log.id;
                const formattedDate = new Date(log.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={log.id} className="p-4 hover:bg-slate-900/30 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      
                      {/* Modality & Info badge */}
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                          log.modality === 'gi' ? 'bg-indigo-950 text-indigo-300 border border-indigo-900' : 'bg-orange-950 text-orange-300 border border-orange-900'
                        }`}>
                          {log.modality === 'gi' ? 'Gi' : 'No-Gi'}
                        </span>
                        <div>
                          <span className="text-slate-300 font-medium text-xs font-mono">{formattedDate}</span>
                          <span className="text-slate-500 text-xs block font-display">
                            {getAcademyName(log.academyId)} • {log.environment === 'normal' ? 'Aula Regular' : log.environment === 'private' ? 'Particular' : 'Open Mat'}
                          </span>
                        </div>
                      </div>

                      {/* General simple performance summary stats & action trigger */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-slate-400">{log.rounds} Rx{log.roundDuration}m</span>
                          <span className="text-slate-500">|</span>
                          <span className="text-emerald-400 font-bold">F:{log.combatStats.submissions}</span>
                          <span className="text-rose-400 font-bold">B:{log.combatStats.taps}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setSelectedLogId(isSelected ? null : log.id)}
                            className="p-1 px-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs text-slate-300 flex items-center gap-1 transition-all"
                            title="Expandir Detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Fechar' : 'Detalhes'}</span>
                          </button>
                          
                          <button 
                            onClick={() => {
                              if(confirm('Tem certeza que deseja excluir este registro de treino?')) {
                                onDeleteLog(log.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-slate-900 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all"
                            title="Excluir Registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Expandable Pedagogical Feedback detail box */}
                    {isSelected && (
                      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        
                        {/* Metrics sidebar details */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display border-b border-slate-800 pb-1">Métricas de Fisiologia e Carga</h4>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                              <span className="text-slate-500 block">Tempo Total</span>
                              <span className="text-slate-200 font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-400" /> {log.totalDuration} min</span>
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                              <span className="text-slate-500 block">Professor Presencial</span>
                              <span className="text-slate-200 font-bold truncate block">{getInstructorName(log.instructorId)}</span>
                            </div>

                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 col-span-2 flex justify-between items-center">
                              <div>
                                <span className="text-slate-500 block">Fisiológico (Cardio)</span>
                                <div className="flex gap-0.5 mt-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={`text-xs ${i < log.cardio ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-right">Intensidade (Força)</span>
                                <div className="flex gap-0.5 mt-0.5 justify-end">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={`text-[11px] ${i < log.intensity ? 'text-rose-500' : 'text-slate-700'}`}>🔥</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Technical combat detailed statistics logs */}
                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-2">
                            <span className="text-[10px] text-slate-500 uppercase font-mono block">Detalhamento Técnico</span>
                            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
                              <div>Finalizações: <strong className="text-emerald-400">{log.combatStats.submissions}</strong></div>
                              <div>Batidas dadas: <strong className="text-rose-400">{log.combatStats.taps}</strong></div>
                              <div>Escapadas: <strong className="text-cyan-400">{log.combatStats.escapes}</strong></div>
                              <div>Raspagens: <strong className="text-amber-405">{log.combatStats.sweeps}</strong></div>
                              <div>Quedas: <strong className="text-purple-400">{log.combatStats.takedowns}</strong></div>
                              <div>Passagens: <strong className="text-blue-400">{log.combatStats.passes}</strong></div>
                            </div>
                          </div>

                          {/* Technical combat detailed specific event listings */}
                          {log.combatEvents && log.combatEvents.length > 0 && (
                            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900 space-y-2.5">
                              <span className="text-[10px] text-slate-400 uppercase font-mono block border-b border-slate-900 pb-1">Técnicas e Ocorrências Gravadas ({log.combatEvents.length})</span>
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {log.combatEvents.map((evt, idx) => {
                                  const typeTags = {
                                    submission: { label: 'Finalização', text: 'text-emerald-400 bg-emerald-950/20 border-emerald-900/60' },
                                    tap: { label: 'Batida (Tap)', text: 'text-rose-400 bg-rose-950/20 border-rose-900/60' },
                                    escape: { label: 'Escapada', text: 'text-cyan-400 bg-cyan-950/20 border-cyan-900/60' },
                                    sweep: { label: 'Raspagem', text: 'text-amber-400 bg-amber-950/20 border-amber-900/60' },
                                    takedown: { label: 'Queda', text: 'text-purple-400 bg-purple-950/20 border-purple-900/60' },
                                    pass: { label: 'Passagem', text: 'text-blue-400 bg-blue-950/20 border-blue-900/60' }
                                  };
                                  const tag = typeTags[evt.type] || { label: evt.type, text: 'text-slate-400 bg-slate-900 border-slate-800' };
                                  return (
                                    <div key={idx} className="text-[11px] font-mono flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900/40 p-2 rounded border border-slate-900 gap-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${tag.text}`}>
                                          {tag.label}
                                        </span>
                                        <span className="text-slate-200 font-medium font-sans">{evt.technique || 'Geral'}</span>
                                      </div>
                                      <span className="text-slate-400 text-[10px] self-start sm:self-auto">Posição/Origem: {evt.situation || 'Transição'}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Qualitative Autopsy inputs */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display border-b border-slate-800 pb-1">Análise Qualitativa da Performance</h4>
                          
                          <div className="space-y-2 text-xs">
                            <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg space-y-1">
                              <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider block font-mono">Pontos Fortes da Sessão (+)</span>
                              <p className="text-slate-300 leading-relaxed font-sans">{log.wentWell || 'Nenhuma nota registrada sobre acertos dadas.'}</p>
                            </div>

                            <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg space-y-1">
                              <span className="text-rose-400 font-bold uppercase text-[9px] tracking-wider block font-mono">Correções Técnicas de Urgência (ø)</span>
                              <p className="text-slate-300 leading-relaxed font-sans">{log.needsImprovement || 'Nenhum detalhe técnico anotado para ajuste.'}</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
