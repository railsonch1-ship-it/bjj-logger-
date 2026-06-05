import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Sparkles, 
  Mail, 
  Send, 
  Check, 
  User, 
  TrendingDown, 
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';

interface FutureModulesProps {
  logsCount: number;
}

export default function FutureModules({ logsCount }: FutureModulesProps) {
  // Config state
  const [professorEmail, setProfessorEmail] = useState('');
  const [professorInvited, setProfessorInvited] = useState(false);
  const [professorTasks, setProfessorTasks] = useState([
    { id: 't-1', task: 'Treinar 15 passagens de guarda emborcando', completed: false, comment: 'Mantenha o quadril colado!' },
    { id: 't-2', task: 'Estudar fuga de costas do tutorial do Rickson', completed: true, comment: 'Excelente alinhamento de cotovelos!' },
  ]);

  // Group Simulation State
  const [isMemberOfGroup, setIsMemberOfGroup] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Gabriel "Napão" Almeida', logs: 14, subs: 36, rank: 1 },
    { name: 'Ana Luisa Correia (Você)', logs: logsCount + 7, subs: 21, rank: 2 },
    { name: 'Igor "Chupeta" Silva', logs: 9, subs: 11, rank: 3 },
    { name: 'Rafael "Soneca" Santos', logs: 6, subs: 18, rank: 4 }
  ]);

  // Degree Level Simulator State
  const [belt, setBelt] = useState<'branca' | 'azul' | 'roxa' | 'marrom' | 'preta'>('azul');
  const [degreeSessionsCount, setDegreeSessionsCount] = useState<number>(logsCount);

  // Send Invitation Form Simulation
  const handleInviteProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorEmail.trim()) return;
    setProfessorInvited(true);
  };

  const handleToggleTask = (id: string) => {
    setProfessorTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSimulateClassNote = () => {
    setDegreeSessionsCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Degree Progress & belt level simulator ("BJJ Notes Level e Graus") */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3 justify-between">
            <div className="flex items-center gap-2 text-slate-100">
              <Award className="w-5 h-5 text-purple-400" />
              <h3 className="font-display font-semibold text-sm">BJJ Notes Level & Graus (Currículo Acadêmico)</h3>
            </div>
            <span className="text-[10px] uppercase font-mono bg-purple-950 text-purple-400 border border-purple-900 px-1.5 py-0.5 rounded font-bold">
              Remoção da Subjetividade
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-400 leading-relaxed font-sans">
              O ecossistema remove o misticismo da graduação. Baseado em presença e domínio técnico efetivo, o sistema calcula sua prontidão física para o próximo grau.
            </p>

            {/* Belt selector */}
            <div className="flex flex-wrap gap-2">
              {(['branca', 'azul', 'roxa', 'marrom', 'preta'] as const).map((b) => {
                const labelColor = {
                  branca: 'bg-white text-slate-950 border-slate-300',
                  azul: 'bg-blue-600 text-white border-blue-800',
                  roxa: 'bg-purple-700 text-white border-purple-900',
                  marrom: 'bg-amber-850 text-white border-amber-950',
                  preta: 'bg-slate-950 text-rose-500 border-rose-950 border-2'
                }[b];
                
                return (
                  <button
                    key={b}
                    onClick={() => setBelt(b)}
                    className={`px-3 py-1 text-[10px] font-bold rounded capitalize tracking-wide select-none ${labelColor} ${
                      belt === b ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-105' : 'opacity-60'
                    }`}
                  >
                    Faixa {b}
                  </button>
                );
              })}
            </div>

            {/* Level progression meter */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-3">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Progresso para o 2º Grau:</span>
                <span className="text-emerald-400 font-bold">{degreeSessionsCount} de 11 treinos validados</span>
              </div>

              {/* Progress Slider bar */}
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (degreeSessionsCount / 11) * 100)}%` }}
                ></div>
                {/* Visual degree ticks dots */}
                <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
                  {[1,2,3,4].map(tick => (
                    <span key={tick} className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-0.7"></span>
                  ))}
                </div>
              </div>

              {degreeSessionsCount >= 11 ? (
                <div className="text-center text-emerald-400 font-bold text-[10px] uppercase font-mono tracking-widest bg-emerald-950/20 py-1.5 rounded border border-emerald-900/60">
                  Pronto para Promoção de Grau! Entre em contato com o mestre.
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 italic">Faltam {Math.max(0, 11 - degreeSessionsCount)} aulas para liberação eletrônica do exame</span>
                  
                  <button
                    onClick={handleSimulateClassNote}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] px-2.5 py-1 rounded transition-all shrink-0"
                  >
                    Simular Aula Assistida (+1)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Teacher Remote prescription panel ("Convide Seu Professor") */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3 justify-between">
            <div className="flex items-center gap-2 text-slate-100">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm">Convide Seu Professor (Curadoria de Treinos)</h3>
            </div>
            <span className="text-[10px] uppercase font-mono bg-emerald-955 text-emerald-400 border border-emerald-950 px-1.5 py-0.5 rounded font-bold">
              Canal de Curadoria
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-400 leading-relaxed font-sans">
              Seu professor pode prescrever "tarefas de combate" diretamente no seu painel de maestria tática e dar feedback qualitativo nas suas falhas de sparring remotamente.
            </p>

            {professorInvited ? (
              <div className="bg-emerald-950/20 border border-emerald-900 p-3.5 rounded-xl text-left space-y-3">
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded inline-block">
                  Conexão Ativa com o Mestre
                </span>
                <p className="text-slate-350 leading-tight">
                  Parabéns! Convite enviado com sucesso para <strong className="text-emerald-400">{professorEmail}</strong>. Ele já pode prescrever deveres:
                </p>

                {/* Simulated homework tasks */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Exercícios Técnicos Prescritos:</span>
                  
                  {professorTasks.map((t) => (
                    <div key={t.id} className="bg-slate-950 border border-slate-900 p-2.5 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => handleToggleTask(t.id)}
                          className={`flex items-center gap-1 text-[11px] font-bold py-0.5 px-2 rounded cursor-pointer transition-all ${
                            t.completed 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          <Check className={`w-3 h-3 ${t.completed ? 'block' : 'opacity-20'}`} />
                          <span>{t.completed ? 'Cumprida!' : 'Marcar como Feito'}</span>
                        </button>
                        <span className="text-[10px] text-slate-500 italic">Prescrição Remota</span>
                      </div>
                      <p className="text-slate-300 font-medium font-sans">{t.task}</p>
                      <p className="text-[10px] text-slate-400 font-mono italic">Mestre comenta: "{t.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteProfessor} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-mono block">E-mail do Seu Professor/Mestre:</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="email" 
                        placeholder="mestre@academia.com.br"
                        value={professorEmail}
                        onChange={(e) => setProfessorEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-lg pl-9 p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 rounded-lg flex items-center justify-center gap-1 transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>Conectar</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 italic block">
                  *Ao aceitar o convite, seu mestre poderá acessar a matriz de logs sem que você precise compartilhar telas ou arquivos.
                </p>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Predictive Cardio drop and Teams ranking panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Predictive analytical insights aba ("Aba Insights") */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3 justify-between">
            <div className="flex items-center gap-2 text-slate-100">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h3 className="font-display font-semibold text-sm">Estação Preditiva de Insights (Análise de Sobrecarga)</h3>
            </div>
            <span className="text-[10px] uppercase font-mono bg-orange-95/10 text-orange-400 border border-orange-950 px-1.5 py-0.5 rounded font-bold">
              Análise Preditiva de Risco
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-400 leading-relaxed text-slate-350">
              Através do cruzamento estocástico de dados, correlacionamos o descolamento de esforço cardiorrespiratório e a densidade de rounds para emitir alertas preditivos de estiramento ou fadiga articular aguda.
            </p>

            <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Monitor de Sobrecarga Cardiorrespiratória & Muscular:</span>
                
                {/* Sports science acute workload panel */}
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-900 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono text-slate-400">Coeficiente ACWR (Acute-to-Chronic):</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-955 text-amber-405 border border-amber-900/60">1.41 - Alerta Agudo</span>
                  </div>
                  
                  {/* Progress bar of ACWR */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex relative border border-slate-800">
                      {/* Safe region */}
                      <div className="h-full bg-emerald-500" style={{ width: '60%' }}></div>
                      {/* Overreaching region */}
                      <div className="h-full bg-amber-500 animate-pulse" style={{ width: '25%' }}></div>
                      {/* Danger region */}
                      <div className="h-full bg-rose-500" style={{ width: '15%' }}></div>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>0.0 (Subtreino)</span>
                      <span className="text-emerald-400 font-bold">0.8 - 1.3 (Ideal)</span>
                      <span>1.5+ (Perigo)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                    <div className="bg-slate-900 p-2 rounded">
                      <span className="text-slate-550 block text-[9px]">CARGA AGUDA (7D):</span>
                      <strong className="text-slate-200">5.5h / semana</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded">
                      <span className="text-slate-550 block text-[9px]">CARGA CRÔNICA (28D):</span>
                      <strong className="text-slate-200">3.9h / semana</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex items-start gap-2.5">
                  <TrendingDown className="w-5 h-5 text-rose-450 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-slate-200 block text-[11px]">Queda na Resposta de Cardio</span>
                    <p className="text-[10px] text-slate-405">
                      Seu rating de cardio caiu 28% comparado com a média móvel. Reduza 1 round de sparring na semana.
                    </p>
                  </div>
                </div>
              </div>

              {/* Injury Warning gauge simulated */}
              <div className="bg-rose-950/20 border border-rose-900/45 p-4 rounded-xl flex flex-col justify-between text-left space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Risco de Lesão: ELEVADO (71%)</span>
                  </div>
                  <p className="text-[10px] text-slate-350 leading-relaxed font-sans">
                    Nossa dedução lógica indica que você está larpando fisicamente: seu corpo está compensando o cansaço cardiorrespiratório com força bruta no final dos rounds. Recomendamos diminuir a intensidade de sparring no Tatame Aberto por 48h!
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 bg-slate-950/60 p-2 rounded border border-slate-900 font-mono italic">
                  *Cálculos autocomputados combinando logs e dados fisiológicos de cardio.
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4. Affiliation and Group lists ("Botão Grupos") */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3 justify-between">
            <div className="flex items-center gap-2 text-slate-100">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="font-display font-semibold text-sm">Equipes & Grupos (Socialização)</h3>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans text-left">
            <p className="text-slate-400 leading-relaxed">
              Dispute o topo de volume semanal com seus companheiros de treino. A socialização baseada em dados incentiva constância no tatame.
            </p>

            {isMemberOfGroup ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-200 font-bold text-[11px]">Equipe Alliance São Paulo</span>
                  <button 
                    onClick={() => setIsMemberOfGroup(false)}
                    className="text-[9px] text-slate-500 hover:text-rose-400 underline"
                  >
                    Sair
                  </button>
                </div>

                {/* Simulated scoreboard list */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-mono block uppercase">Ranking de Volume da Semana:</span>
                  
                  {leaderboard.map((user) => (
                    <div key={user.name} className="flex justify-between items-center text-xs font-mono bg-slate-950 p-2 rounded border border-slate-900">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 text-center font-bold font-display ${user.rank === 1 ? 'text-amber-400' : 'text-slate-550'}`}>#{user.rank}</span>
                        <span className="text-slate-300 font-sans truncate w-32">{user.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold">{user.logs} treinos</span>
                        <span className="text-slate-600 text-[10px] block font-sans">{user.subs} Finalizações</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-center space-y-3.5">
                <Users className="w-8 h-8 text-purple-400 mx-auto" strokeWidth={1} />
                <div className="space-y-1">
                  <span className="text-slate-200 font-bold font-display block">Escolha uma Divisão Pública</span>
                  <p className="text-[10px] text-slate-500">Conecte-se aos companheiros e compartilhe marcas corporativas.</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsMemberOfGroup(true)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-slate-950 font-bold py-2 rounded text-xs transition-all pointer"
                >
                  Filiar-se à Equipe Alliance SP
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
