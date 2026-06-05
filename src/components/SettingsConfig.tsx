import React, { useState } from 'react';
import { Instructor, Academy, TrainingLog, FocusTechnique, GamePlan } from '../types';
import { 
  Settings, 
  User, 
  Trash2, 
  Plus, 
  Building, 
  GraduationCap, 
  RefreshCw,
  HelpCircle,
  Download,
  FileText,
  Smartphone,
  Wifi,
  Cpu
} from 'lucide-react';

interface SettingsConfigProps {
  instructors: Instructor[];
  academies: Academy[];
  onAddInstructor: (name: string) => void;
  onDeleteInstructor: (id: string) => void;
  onAddAcademy: (name: string) => void;
  onDeleteAcademy: (id: string) => void;
  onResetDatabase: () => void;
  logs: TrainingLog[];
  focusTechniques: FocusTechnique[];
  gamePlan: GamePlan;
  onImportBackup: (data: {
    logs: TrainingLog[];
    focusTechniques: FocusTechnique[];
    gamePlan: GamePlan;
    instructors: Instructor[];
    academies: Academy[];
  }) => void;
}

export default function SettingsConfig({
  instructors,
  academies,
  onAddInstructor,
  onDeleteInstructor,
  onAddAcademy,
  onDeleteAcademy,
  onResetDatabase,
  logs,
  focusTechniques,
  gamePlan,
  onImportBackup
}: SettingsConfigProps) {
  // Local temporary inputs
  const [newInst, setNewInst] = useState('');
  const [newAcad, setNewAcad] = useState('');

  // User details local State
  const [userBelt, setUserBelt] = useState('Azul');
  const [userWeight, setUserWeight] = useState('82');
  const [userStartYear, setUserStartYear] = useState('2021');

  const handleAddInstructorLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInst.trim()) return;
    onAddInstructor(newInst.trim());
    setNewInst('');
  };

  const handleAddAcademyLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcad.trim()) return;
    onAddAcademy(newAcad.trim());
    setNewAcad('');
  };

  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          throw new Error("Arquivo vazio ou corrompido.");
        }

        const match = text.match(/<!-- BJJ_STATE_BACKUP_JSON\n([\s\S]+?)\n-->/);
        if (!match || !match[1]) {
          throw new Error("Não foi possível encontrar a assinatura 'BJJ_STATE_BACKUP_JSON' de dados válidos no arquivo Markdown. Certifique-se de carregar um arquivo de backup original gerado por esta ferramenta.");
        }

        const data = JSON.parse(match[1]);

        if (!data.logs || !Array.isArray(data.logs)) {
          throw new Error("Não foi encontrado um backup estruturado ou o formato de registros é inválido.");
        }

        onImportBackup(data);
        setImportSuccess(true);
      } catch (err: any) {
        setImportError(err.message || "Erro desconhecido ao decodificar arquivo.");
      }
    };
    reader.readAsText(file);
  };

  const downloadMarkdownBackup = () => {
    let md = `# RELATÓRIO DO ECOSSISTEMA JIU-JITSU PERFORMANCE LOGGER
Gerado em: ${new Date().toLocaleString('pt-BR')}
Atleta Cadastrado: Ana Luisa Correia
Faixa: ${userBelt} | Peso: ${userWeight} kg | Ano de Início: ${userStartYear}

---

## 1. HISTÓRICO DE TREINOS E TELEMETRIA DE SPARRIING
Total de sessões ativas: ${logs.length}

`;

    logs.forEach((log, index) => {
      const isQuickStr = log.isQuick ? 'RÁPIDO' : 'DETALHADO';
      const parsedDate = new Date(log.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      md += `### Treino #${logs.length - index} - ${parsedDate} [${isQuickStr}]
- **Modalidade**: ${log.modality === 'gi' ? 'Kimono (Gi)' : 'No-Gi'}
- **Ambiente/Aula**: ${log.environment === 'normal' ? 'Aula Regular' : log.environment === 'private' ? 'Particular' : 'Open Mat'}
- **Professor Presencial**: ${instructors.find(i => i.id === log.instructorId)?.name || 'Sem Instrutor'}
- **Academia/QG**: ${academies.find(a => a.id === log.academyId)?.name || 'Sem Academia'}
- **Tempo Total**: ${log.totalDuration} min (${log.rounds} rounds de ${log.roundDuration}m com ${log.restDuration}m descanso)
- **Fisiológico (Cardio)**: ${'★'.repeat(Math.max(0, log.cardio))}${'☆'.repeat(Math.max(0, 5 - log.cardio))}
- **Intensidade (Força)**: ${'🔥'.repeat(Math.max(0, log.intensity))}
- **Métricas de Placar**:
  - Finalizações Aplicadas: ${log.combatStats.submissions}
  - Batidas Sofridas (Taps): ${log.combatStats.taps}
  - Escapadas de Sufoco: ${log.combatStats.escapes}
  - Raspagens Realizadas: ${log.combatStats.sweeps}
  - Quedas Aplicadas: ${log.combatStats.takedowns}
  - Passagens de Guarda: ${log.combatStats.passes}

`;

      if (log.combatEvents && log.combatEvents.length > 0) {
        md += `#### Ocorrências Técnicas Registradas:
| Tipo de Ação | Técnica Executada / Situação | Posição de Início ou Origem |
| :--- | :--- | :--- |
`;
        log.combatEvents.forEach(evt => {
          const typeLabels = {
            submission: '🎯 Finalização Aplicada',
            tap: '💀 Batida Sofrida (Tap)',
            escape: '🏃 Escapada',
            sweep: '🔄 Raspagem Realizada',
            takedown: '🤼 Queda Aplicada',
            pass: '🛡️ Passagem de Guarda'
          };
          md += `| ${typeLabels[evt.type] || evt.type} | ${evt.technique || 'Geral'} | ${evt.situation || 'Transição'} |\n`;
        });
        md += '\n';
      }

      if (!log.isQuick) {
        md += `#### Feedback Loop Pedagógico:
- **Pontos Fortes (O que correu bem)**:
  ${log.wentWell || 'Nenhuma nota registrada.'}
- **Ajustes de Urgência**:
  ${log.needsImprovement || 'Nenhum nota registrada.'}

`;
      }
      md += `---\n\n`;
    });

    md += `## 2. MAESTRIA EM FOCO (DIRETRIZES DE ESTRESS-TESTE)
Total de alvos de focos cadastrados: ${focusTechniques.length}

`;
    focusTechniques.forEach((tech) => {
      md += `### ${tech.name} (Alvo de Prática)
- **Volume de Tentativas**: ${tech.totalAttempts} tentativas
- **Repetições com Sucesso**: ${tech.successfulReps} acertos
- **Percentual de Eficácia**: ${tech.totalAttempts > 0 ? Math.round((tech.successfulReps / tech.totalAttempts) * 100) : 0}%
- **Início da Meta**: ${new Date(tech.startDate).toLocaleDateString('pt-BR')}

`;
    });

    const identityMap: Record<string, string> = { guardeiro: 'Guardeiro', passador: 'Passador', hibrido: 'Híbrido' };
    const styleMap: Record<string, string> = { movimentacao: 'Movimentação/Agilidade', pressao: 'Pressão/Esmagamento', contra_ataque: 'Contra-ataque/Reacionário' };
    const archetypeMap: Record<string, string> = {
      leg_locker: 'Leg Locker 🦿',
      pegador_costas: 'Pegador de Costas 🎒',
      cacador_bracos: 'Caçador de Braços 🦾',
      guilhotina: 'Guilhotinador 🌪️',
      estrangulador: 'Estrangulador da Morte 💀',
      raspador: 'Raspador Lendário 🔄',
      scrambler: 'Caótico Scrambler ⚡'
    };

    md += `\n--5678--\n\n## 3. ARQUITETURA TÁTICA (GAME PLAN)
- **Identidade Estilística**: ${identityMap[gamePlan.identity] || gamePlan.identity || 'Não definida'}
- **Estilo de Luta**: ${styleMap[gamePlan.style] || gamePlan.style || 'Não definido'}
- **Arquétipo Principal**: ${archetypeMap[gamePlan.archetype] || gamePlan.archetype || 'Não definido'}
- **Foco de Competição**: ${gamePlan.competitionName || 'Não agendada'} (${gamePlan.competitionDate ? new Date(gamePlan.competitionDate).toLocaleDateString('pt-BR') : 'Sem data'})

### Arsenal de Técnicas Cadastradas:
`;
    if (gamePlan.techniques && gamePlan.techniques.length > 0) {
      gamePlan.techniques.forEach((tech) => {
        md += `- **[${tech.position.toUpperCase()}]** ${tech.name}: ${tech.description || 'Sem descrição'}\n`;
      });
    } else {
      md += `Nenhuma técnica cadastrada no arsenal tático.\n`;
    }

    md += `\n### Matriz Condicional (Regras Táticas):
`;
    if (gamePlan.rules && gamePlan.rules.length > 0) {
      gamePlan.rules.forEach((rule, idx) => {
        md += `${idx + 1}. **Se** o oponente fizer: *${rule.trigger}* -> **Então** eu devo fazer: *${rule.technique}*\n`;
      });
    } else {
      md += `Nenhuma regra condicional cadastrada.\n`;
    }

    md += `\n### Escapadas Críticas Recomendadas:
`;
    if (gamePlan.criticalEscapes && gamePlan.criticalEscapes.length > 0) {
      gamePlan.criticalEscapes.forEach((esc) => {
        md += `- **Fuga da Posição [${esc.position}]**: ${esc.plan}\n`;
      });
    } else {
      md += `Nenhuma escapada crítica catalogada.\n`;
    }

    md += `\n### Lembretes Mentais de Sobrevivência:
`;
    if (gamePlan.mentalReminders && gamePlan.mentalReminders.length > 0) {
      gamePlan.mentalReminders.forEach((rem) => {
        md += `- ${rem}\n`;
      });
    } else {
      md += `Nenhum lembrete cadastrado.\n`;
    }

    // JSON payload injection for database recovery
    const jsonPayload = JSON.stringify({
      logs,
      focusTechniques,
      gamePlan,
      instructors,
      academies
    });

    md += `\n\n<!-- BJJ_STATE_BACKUP_JSON\n${jsonPayload}\n-->\n\n`;

    md += `---\n*Fim do Relatório de Backup do Ecossistema Jiu-Jitsu Logger. Salve este documento para portar entre bases táticas corporativas.*`;

    // Trigger browser download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', `bjj_backup_report_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="space-y-6">

      {/* Main Header */}
      <div className="bg-slate-950 border border-slate-900 duration-150 p-5 rounded-xl space-y-0.5">
        <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <span>Configurações & Elementos de Customização de Dados</span>
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          Estipule padrões táticos, cadastre sua linhagem de instrutores e limite a redundância para lançar registros detalhados em segundos sem complicações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Athlete profile configuration */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <User className="w-4 h-4 text-purple-400" />
            <span>Perfil Corporativo do Atleta</span>
          </h3>

          <div className="space-y-4 text-xs font-sans">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono block">Graduação Atual / Faixa:</label>
              <select 
                value={userBelt} 
                onChange={(e) => setUserBelt(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-850 p-2.5 rounded-lg focus:outline-none"
              >
                <option value="Branca">⚪ Faixa Branca</option>
                <option value="Azul">🔵 Faixa Azul</option>
                <option value="Roxa">🟣 Faixa Roxa</option>
                <option value="Marrom">🟤 Faixa Marrom</option>
                <option value="Preta">⚫ Faixa Preta</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono block">Peso de Combate (kg):</label>
              <input 
                type="number"
                value={userWeight}
                onChange={(e) => setUserWeight(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-850 p-2.5 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono block">Ano de Início da Prática:</label>
              <input 
                type="number"
                value={userStartYear}
                onChange={(e) => setUserStartYear(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-850 p-2.5 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 text-slate-400 text-[11px] leading-relaxed">
              *Seus dados de biotipo ajudam a segmentar o índice cardíaco e a intensidade relativa de forma precisa.
            </div>
          </div>
        </div>

        {/* Column 2: Instructors configuration preset */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Matriz de Instrutores Credenciados</span>
          </h3>

          <div className="space-y-4 text-xs font-sans">
            
            {/* Inline Instructor additions form */}
            <form onSubmit={handleAddInstructorLocal} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Abençoar novo Mestre... Ex: Rickson"
                value={newInst}
                onChange={(e) => setNewInst(e.target.value)}
                className="bg-slate-900 text-slate-200 border border-slate-850 p-2 rounded-lg flex-1 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button 
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1 rounded-lg hover:shadow cursor-pointer flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* List of instructors in storage */}
            <div className="divide-y divide-slate-900 max-h-56 overflow-y-auto pr-1">
              {instructors.map((i) => (
                <div key={i.id} className="py-2.5 flex justify-between items-center bg-slate-950/40">
                  <span className="text-slate-300 font-medium font-sans">🥋 {i.name}</span>
                  <button 
                    onClick={() => onDeleteInstructor(i.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Column 3: Academies configuration preset */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Alianças Acadêmicas / QG</span>
          </h3>

          <div className="space-y-4 text-xs font-sans">
            
            {/* Inline Academies addition form */}
            <form onSubmit={handleAddAcademyLocal} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nome da filial acadêmica..."
                value={newAcad}
                onChange={(e) => setNewAcad(e.target.value)}
                className="bg-slate-900 text-slate-200 border border-slate-850 p-2 rounded-lg flex-1 text-xs focus:outline-none focus:border-cyan-500"
              />
              <button 
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-3 py-1 rounded-lg hover:shadow cursor-pointer flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* List of academies */}
            <div className="divide-y divide-slate-900 max-h-56 overflow-y-auto pr-1">
              {academies.map((a) => (
                <div key={a.id} className="py-2.5 flex justify-between items-center bg-slate-950/40">
                  <span className="text-slate-300 font-medium font-sans">🏢 {a.name}</span>
                  <button 
                    onClick={() => onDeleteAcademy(a.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-900 pb-3 justify-between">
          <div className="flex items-center gap-2 text-slate-100">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-semibold text-sm">Sincronização & Backup de Segurança (Dispositivo Remoto / Downloads)</h3>
          </div>
          <span className="text-[10px] uppercase font-mono bg-purple-950/40 text-purple-400 border border-purple-900 px-1.5 py-0.5 rounded font-bold">
            Downloads & Uploads
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Download Column */}
          <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-purple-400 uppercase font-mono block">Exportar dados (.md):</span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Gere um arquivo de texto Markdown contendo o relatório completo do seu progresso, arsenal de técnicas e todas as regras do seu Game Plan. O relatório contém uma assinatura eletrônica oculta para portar e carregar seus dados em qualquer dispositivo.
              </p>
            </div>
            
            <button
              onClick={downloadMarkdownBackup}
              className="bg-purple-500 hover:bg-purple-600 text-slate-950 font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:shadow-lg text-xs self-start mt-2"
            >
              <Download className="w-4 h-4" />
              <span>Gerar Relatório de Backup</span>
            </button>
          </div>

          {/* Upload Column */}
          <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-purple-400 uppercase font-mono block">Importar de arquivo (.md):</span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Selecione um arquivo de relatório de backup exportado anteriormente por este ecossistema para restaurar instantaneamente todo o seu histórico de lutas e perfis táticos.
              </p>
            </div>

            <div className="space-y-2.5">
              <label className="block">
                <span className="sr-only">Selecione o arquivo de backup</span>
                <input 
                  type="file" 
                  accept=".md" 
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-xs file:font-semibold
                    file:bg-slate-950 file:text-purple-400
                    file:border file:border-purple-900/40
                    hover:file:bg-slate-900 file:cursor-pointer cursor-pointer"
                />
              </label>

              {importSuccess && (
                <div className="p-2 bg-emerald-950/40 border border-emerald-900 rounded-lg text-[11px] text-emerald-400">
                  ✓ Base de dados integrada e sincronizada com sucesso! Redirecionando...
                </div>
              )}
              {importError && (
                <div className="p-2 bg-rose-950/40 border border-rose-900 rounded-lg text-[11px] text-rose-400 font-mono">
                  Erro: {importError}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION: TECNOLOGIA PWA E OFFLINE */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-900 pb-3 justify-between">
          <div className="flex items-center gap-2 text-slate-100">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-semibold text-sm">Tecnologia PWA (Progressive Web App) & Suporte Offline</h3>
          </div>
          <span className="text-[10px] uppercase font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-bold">
            Ativo & Seguro
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-sans">
          
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-slate-200">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-xs">Service Worker Caching</h4>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              O ecossistema salva localmente todas as rotas de scripts, estilos, páginas e o ícone BJJ. Isso permite você carregar e visualizar seus treinos mesmo sem Internet no telefone.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-slate-200">
              <Settings className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-xs">Aplicativo Nativo</h4>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Compatível com Safari iOS e Chrome Android. Instale para receber suporte de tela cheia sem barra de endereços do navegador e usufruir de resposta tátil imediata.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-2">
            <div className="flex items-center gap-2 text-slate-200">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-xs">Persistência Blindada</h4>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Suas táticas, registros e conquistas continuam salvos de forma 100% persistente em localStorage seguro no próprio aparelho, imune a desconexões externas.
            </p>
          </div>

        </div>
      </div>

      {/* Dangerous/Reset controls zone */}
      <div className="bg-slate-950 border border-red-950 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-sm text-amber-500">Zerar Base de Dados / Reiniciar Exercício</h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Se você deseja zerar os logs criados para efetuar testes puros pós-desenvolvimento, esta ação carrega de volta as sessões de treino pré-preenchidas e as táticas de exemplo criadas pela nossa engenharia. This action is irreversible.
          </p>
        </div>

        <button 
          onClick={() => {
            if (confirm('Tem certeza de que deseja apagar todos os seus dados personalizados de teste e carregar o blueprint original?')) {
              onResetDatabase();
            }
          }}
          className="bg-rose-950 border border-rose-820 hover:bg-rose-900 hover:text-white text-rose-300 font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Restaurar Banco Blueprint</span>
        </button>
      </div>

    </div>
  );
}
