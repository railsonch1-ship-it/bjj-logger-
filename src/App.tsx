import { useState, useEffect } from 'react';
import { 
  TrainingLog, 
  FocusTechnique, 
  GamePlan, 
  HealthStatus, 
  Instructor, 
  Academy, 
  Achievement 
} from './types';
import { 
  INITIAL_LOGS, 
  INITIAL_FOCUS_TECHNIQUES, 
  INITIAL_GAME_PLAN, 
  INITIAL_HEALTH, 
  INITIAL_INSTRUCTORS, 
  INITIAL_ACADEMIES, 
  INITIAL_ACHIEVEMENTS 
} from './initialData';

// Component imports
import Dashboard from './components/Dashboard';
import TrainingLogForm from './components/TrainingLogForm';
import FocusModule from './components/FocusModule';
import GamePlanBuilder from './components/GamePlanBuilder';
import HealthTracker from './components/HealthTracker';
import FutureModules from './components/FutureModules';
import SettingsConfig from './components/SettingsConfig';

// Icons for App header navigation
import { 
  Trophy, 
  PlusCircle, 
  Target, 
  Map, 
  Heart, 
  Settings, 
  Sparkles,
  Zap,
  Activity,
  Award,
  Smartphone,
  Share2
} from 'lucide-react';

export default function App() {
  // --- STATE PERSISTENCE IN LOCALSTORAGE ---
  const [logs, setLogs] = useState<TrainingLog[]>(() => {
    const saved = localStorage.getItem('bjj_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [focusTechniques, setFocusTechniques] = useState<FocusTechnique[]>(() => {
    const saved = localStorage.getItem('bjj_focus_tech');
    return saved ? JSON.parse(saved) : INITIAL_FOCUS_TECHNIQUES;
  });

  const [gamePlan, setGamePlan] = useState<GamePlan>(() => {
    const saved = localStorage.getItem('bjj_game_plan');
    return saved ? JSON.parse(saved) : INITIAL_GAME_PLAN;
  });

  const [healthStatus, setHealthStatus] = useState<HealthStatus>(() => {
    const saved = localStorage.getItem('bjj_health');
    return saved ? JSON.parse(saved) : INITIAL_HEALTH;
  });

  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const saved = localStorage.getItem('bjj_instructors');
    return saved ? JSON.parse(saved) : INITIAL_INSTRUCTORS;
  });

  const [academies, setAcademies] = useState<Academy[]>(() => {
    const saved = localStorage.getItem('bjj_academies');
    return saved ? JSON.parse(saved) : INITIAL_ACADEMIES;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('bjj_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // --- PWA INSTALLATION STATE ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [showIOSInstallTip, setShowIOSInstallTip] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect if running on iOS device to offer the share button instruction
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setShowIOSInstallTip(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Resultado da instalação PWA: ${outcome}`);
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // --- PERSISTENCE SYNCHRONIZER EFFECTS ---
  useEffect(() => {
    localStorage.setItem('bjj_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('bjj_focus_tech', JSON.stringify(focusTechniques));
  }, [focusTechniques]);

  useEffect(() => {
    localStorage.setItem('bjj_game_plan', JSON.stringify(gamePlan));
  }, [gamePlan]);

  useEffect(() => {
    localStorage.setItem('bjj_health', JSON.stringify(healthStatus));
  }, [healthStatus]);

  useEffect(() => {
    localStorage.setItem('bjj_instructors', JSON.stringify(instructors));
  }, [instructors]);

  useEffect(() => {
    localStorage.setItem('bjj_academies', JSON.stringify(academies));
  }, [academies]);

  useEffect(() => {
    localStorage.setItem('bjj_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // --- DYNAMIC GAMIFICATION SYSTEM CHECKER ---
  useEffect(() => {
    // Check if new achievements need unlocking on each log update
    let updated = false;
    const newAchievements = achievements.map(ach => {
      if (ach.unlockedAt) return ach; // Already unlocked

      // 1. Casca Grossa: 5 Gi logs
      if (ach.id === 'ach-1') {
        const giCount = logs.filter(l => l.modality === 'gi').length;
        if (giCount >= 5) {
          updated = true;
          return { ...ach, unlockedAt: new Date().toISOString() };
        }
      }

      // 2. Finalizador Nato: Total subs > 10
      if (ach.id === 'ach-2') {
        const totalSubs = logs.reduce((sum, l) => sum + l.combatStats.submissions, 0);
        if (totalSubs >= 10) {
          updated = true;
          return { ...ach, unlockedAt: new Date().toISOString() };
        }
      }

      // 3. Indiana Jones: escapes > 5
      if (ach.id === 'ach-3') {
        const totalEsc = logs.reduce((sum, l) => sum + l.combatStats.escapes, 0);
        if (totalEsc >= 5) {
          updated = true;
          return { ...ach, unlockedAt: new Date().toISOString() };
        }
      }

      // 4. Resiliência Suprema: Trained in last 3 weeks consecutively
      // Pre-unlocked in mock initialData for UI fidelity but check here:
      if (ach.id === 'ach-4') {
        if (logs.length >= 7) {
          updated = true;
          return { ...ach, unlockedAt: new Date().toISOString() };
        }
      }

      // 5. Mestre do Jogo: GP rules >= 3
      if (ach.id === 'ach-5') {
        if (gamePlan.rules.length >= 3) {
          updated = true;
          return { ...ach, unlockedAt: new Date().toISOString() };
        }
      }

      return ach;
    });

    if (updated) {
      setAchievements(newAchievements);
    }
  }, [logs, gamePlan.rules]);

  // --- ACTIONS HANDLERS ---
  const handleAddLog = (newLog: Omit<TrainingLog, 'id'>) => {
    const log: TrainingLog = {
      ...newLog,
      id: `log-${Date.now()}`
    };
    setLogs(prev => [log, ...prev]);
    setActiveTab('dashboard'); // Auto-redirects to dashboard after logs addition
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleAddTechnique = (newTech: Omit<FocusTechnique, 'id'>) => {
    const tech: FocusTechnique = {
      ...newTech,
      id: `focus-${Date.now()}`
    };
    setFocusTechniques(prev => [tech, ...prev]);
  };

  const handleUpdateReps = (id: string, successful: boolean) => {
    setFocusTechniques(prev => prev.map(tech => {
      if (tech.id !== id) return tech;
      
      const updatedSuccessful = successful ? tech.successfulReps + 1 : tech.successfulReps;
      // If recovery active, we still let them click but we adjust reps.
      return {
        ...tech,
        successfulReps: updatedSuccessful,
        totalAttempts: tech.totalAttempts + 1
      };
    }));
  };

  const handleDeleteTechnique = (id: string) => {
    setFocusTechniques(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTechnique = (updatedTech: FocusTechnique) => {
    setFocusTechniques(prev => prev.map(t => t.id === updatedTech.id ? updatedTech : t));
  };

  const handleUpdateGamePlan = (gp: GamePlan) => {
    setGamePlan(gp);
  };

  const handleUpdateHealth = (hs: HealthStatus) => {
    setHealthStatus(hs);
  };

  const handleAddInstructor = (name: string) => {
    const inst = { id: `inst-${Date.now()}`, name };
    setInstructors(prev => [...prev, inst]);
  };

  const handleDeleteInstructor = (id: string) => {
    setInstructors(prev => prev.filter(i => i.id !== id));
  };

  const handleAddAcademy = (name: string) => {
    const acad = { id: `acad-${Date.now()}`, name };
    setAcademies(prev => [...prev, acad]);
  };

  const handleDeleteAcademy = (id: string) => {
    setAcademies(prev => prev.filter(a => a.id !== id));
  };

  const handleResetDatabase = () => {
    setLogs(INITIAL_LOGS);
    setFocusTechniques(INITIAL_FOCUS_TECHNIQUES);
    setGamePlan(INITIAL_GAME_PLAN);
    setHealthStatus(INITIAL_HEALTH);
    setInstructors(INITIAL_INSTRUCTORS);
    setAcademies(INITIAL_ACADEMIES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setActiveTab('dashboard');
  };

  const handleImportBackup = (data: {
    logs: TrainingLog[];
    focusTechniques: FocusTechnique[];
    gamePlan: GamePlan;
    instructors: Instructor[];
    academies: Academy[];
  }) => {
    if (data.logs) setLogs(data.logs);
    if (data.focusTechniques) setFocusTechniques(data.focusTechniques);
    if (data.gamePlan) setGamePlan(data.gamePlan);
    if (data.instructors) setInstructors(data.instructors);
    if (data.academies) setAcademies(data.academies);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans transition-all selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header / Navigation Sidebar */}
      <header className="border-b lg:border-b-0 lg:border-r border-slate-900 bg-slate-950 sticky top-0 lg:h-screen lg:w-64 z-30 shadow-sm flex flex-col shrink-0">
        <div className="w-full px-4 lg:px-6 py-4 lg:py-8 flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-4 h-full overflow-x-auto lg:overflow-x-visible">
          
          {/* Logo & title block */}
          <div className="flex items-center lg:items-start gap-3 shrink-0">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 lg:p-2.5 rounded-lg lg:rounded-xl shadow-lg shadow-emerald-500/10">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-slate-950 stroke-[3]" />
            </div>
            <div className="text-left">
              <h1 className="text-xs lg:text-sm font-bold font-display tracking-tight text-white flex flex-col">
                <span className="font-mono text-[11px] lg:text-[12px] font-black tracking-widest text-slate-100 leading-none">BJJ NOTES // INTEL</span>
                {healthStatus.isRecoveryTimeOff && (
                  <span className="text-[8px] font-bold bg-amber-500/20 text-amber-500 border border-amber-900/40 px-1 py-0.2 rounded mt-1 tracking-wider uppercase inline-block w-fit">
                    REABILITAÇÃO
                  </span>
                )}
              </h1>
              <p className="text-[9px] text-slate-400 hidden lg:block mt-1">Logger de Performance Fisiológica e Prática Deliberada</p>
            </div>
          </div>

          {/* Tab switches */}
          <nav className="flex flex-row lg:flex-col items-center lg:items-stretch gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-850 shrink-0 lg:mt-6 overflow-x-auto lg:overflow-visible max-w-full lg:max-w-none">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Trophy },
              { id: 'novolog', label: 'Registrar Treino', icon: PlusCircle },
              { id: 'focus', label: 'Foco Técnico', icon: Target },
              { id: 'gameplan', label: 'Game Plan', icon: Map },
              { id: 'health', label: 'Saúde & Carga', icon: Heart },
              { id: 'future', label: 'Insights & Graus', icon: Sparkles },
              { id: 'settings', label: 'Customização', icon: Settings },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center lg:justify-between gap-1.5 cursor-pointer whitespace-nowrap lg:whitespace-normal ${
                    isActive 
                      ? 'bg-slate-800 text-emerald-400 shadow' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <TabIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </div>
                  {isActive && <span className="hidden lg:inline text-slate-400 font-mono text-[9px]">&rarr;</span>}
                </button>
              );
            })}
          </nav>

          {/* Decor panel matching Carlos' identity / active belt of the competitor */}
          <div className="hidden lg:flex mt-auto p-3.5 bg-slate-900 border border-slate-850 rounded-xl items-center gap-3 w-full">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-slate-100 truncate">Carlos Silva</div>
              <div className="text-[9px] text-slate-500 font-mono uppercase">Faixa Roxa • Ativo</div>
            </div>
            <div className="w-10 h-3 rounded bg-purple-700 relative overflow-hidden border border-slate-900 shrink-0">
              <div className="absolute right-0 w-3 h-full bg-slate-950 border-l border-slate-50"></div>
            </div>
          </div>

          {/* Install BJJ Logger Desktop Promo */}
          {(isInstallable || showIOSInstallTip) && (
            <div className="hidden lg:block mt-3 p-3.5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-2 text-xs w-full">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[10px] uppercase font-mono">
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span>Aplicativo PWA</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                {isInstallable 
                  ? "Instale o BJJ Logger para acesso rápido offline direto por sua tela inicial." 
                  : "Adicione como app nas configurações de compartilhamento de seu iPhone."}
              </p>
              {isInstallable && (
                <button
                  onClick={handleInstallApp}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all text-slate-950 font-bold py-1.5 rounded-lg text-[10px] cursor-pointer"
                >
                  Instalar no Dispositivo
                </button>
              )}
            </div>
          )}

        </div>
      </header>

      {/* Main & Footer scroll wrapper next to sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto lg:h-screen">
        
        {/* 2. Primary Layout Canvas */}
        <main className="flex-grow p-4 md:p-8">
          <div className="animate-fadeIn animate-duration-300">
            
            {/* PWA Mobile install promotion bar */}
            {(isInstallable || showIOSInstallTip) && (
              <div className="lg:hidden mb-6 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-450 font-semibold text-xs uppercase font-mono">
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>Instalar BJJ Performance Logger</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isInstallable 
                      ? "Acesse todo o seu histórico e game plan instantaneamente adicionando este PWA à sua tela inicial." 
                      : "Toque em Compartilhar e selecione 'Adicionar à Tela de Início' para instalar o aplicativo no seu iPhone."
                    }
                  </p>
                </div>
                {isInstallable && (
                  <button
                    onClick={handleInstallApp}
                    className="w-full sm:w-auto shrink-0 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Instalar App
                  </button>
                )}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <Dashboard 
                logs={logs}
                instructors={instructors}
                academies={academies}
                onDeleteLog={handleDeleteLog}
              />
            )}

            {activeTab === 'novolog' && (
              <TrainingLogForm 
                onAddLog={handleAddLog}
                instructors={instructors}
                academies={academies}
                onAddInstructor={handleAddInstructor}
                onAddAcademy={handleAddAcademy}
                isRecoveryActive={healthStatus.isRecoveryTimeOff}
              />
            )}

            {activeTab === 'focus' && (
              <FocusModule 
                techniques={focusTechniques}
                achievements={achievements}
                onAddTechnique={handleAddTechnique}
                onUpdateReps={handleUpdateReps}
                onDeleteTechnique={handleDeleteTechnique}
                onEditTechnique={handleEditTechnique}
              />
            )}

            {activeTab === 'gameplan' && (
              <GamePlanBuilder 
                gamePlan={gamePlan}
                onUpdateGamePlan={handleUpdateGamePlan}
              />
            )}

            {activeTab === 'health' && (
              <HealthTracker 
                healthStatus={healthStatus}
                onUpdateHealth={handleUpdateHealth}
              />
            )}

            {activeTab === 'future' && (
               <FutureModules 
                logsCount={logs.length}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsConfig 
                instructors={instructors}
                academies={academies}
                onAddInstructor={handleAddInstructor}
                onDeleteInstructor={handleDeleteInstructor}
                onAddAcademy={handleAddAcademy}
                onDeleteAcademy={handleDeleteAcademy}
                onResetDatabase={handleResetDatabase}
                logs={logs}
                focusTechniques={focusTechniques}
                gamePlan={gamePlan}
                onImportBackup={handleImportBackup}
              />
            )}

          </div>
        </main>

        {/* 3. Humble, Elegant, Non-Intrusive Footer inside main column */}
        <footer className="border-t border-slate-900 py-6 text-center text-slate-650 bg-slate-950 mt-auto">
          <div className="px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-mono">
            <span>BJJ Performance Logger © 2026</span>
            <div className="flex gap-4">
              <span>Constância • Técnica • Longevidade Corporal</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
