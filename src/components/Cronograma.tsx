import React, { useState, useEffect } from 'react';
import { StudySchedule, StudyTask, TaskType } from '../types';
import { Calendar, Layers, Clock, Shield, Sparkles, RefreshCw, BadgeHelp, CheckCircle2, AlertCircle, Sliders, Check, SlidersHorizontal, ArrowRight, Settings, ChevronDown, ChevronUp, X } from 'lucide-react';

interface CronogramaProps {
  schedule: StudySchedule;
  onboardingData: any;
  onUpdateSchedule: (newSchedule: StudySchedule) => void;
  onUpdateOnboardingData?: (newData: any) => void;
  theme?: 'light' | 'dark';
}

// Default discipline distribution models for fallback or freshly populated days
const TEMPLATE_DISCIPLINES: Record<string, { name: string; activityType: TaskType; topic: string; baseWeight: number }[]> = {
  'Segunda': [
    { name: 'Legislação de Trânsito', activityType: 'teoria', topic: 'Artigos 1º ao 16º: Sistema Nacional de Trânsito no CTB', baseWeight: 0.45 },
    { name: 'Língua Portuguesa', activityType: 'teoria', topic: 'Sintaxe e regência de termos - Foco nas permutas de palavras CEBRASPE', baseWeight: 0.35 },
    { name: 'Direito Constitucional', activityType: 'revisão', topic: 'Defesa do Estado e Segurança Pública (Art. 144 CF)', baseWeight: 0.20 }
  ],
  'Terça': [
    { name: 'Direito Penal', activityType: 'questões', topic: 'Teoria do crime: fato típico, culpabilidade, ilicitude e dolo', baseWeight: 0.40 },
    { name: 'Raciocínio Lógico-Matemático', activityType: 'teoria', topic: 'Proposições lógicas, conectivos, tabela-verdade e tautologia', baseWeight: 0.30 },
    { name: 'Física', activityType: 'teoria', topic: 'Dinâmica do Trauma: Energia cinética durante desaceleração veicular', baseWeight: 0.30 }
  ],
  'Quarta': [
    { name: 'Legislação de Trânsito', activityType: 'questões', topic: 'Normas Gerais de Circulação e Conduta (Artigos 26 ao 48 do CTB)', baseWeight: 0.45 },
    { name: 'Direito Administrativo', activityType: 'teoria', topic: 'Poder de polícia administrativa, limites e discricionariedade', baseWeight: 0.30 },
    { name: 'Informática', activityType: 'revisão', topic: 'Redes de computadores, protocolos de internet e segurança da informação', baseWeight: 0.25 }
  ],
  'Quinta': [
    { name: 'Língua Portuguesa', activityType: 'questões', topic: 'Reescrita de frases e substituição de palavras no padrão CEBRASPE', baseWeight: 0.40 },
    { name: 'Direito Processual Penal', activityType: 'teoria', topic: 'Inquérito policial: características, prazos e valor probatório', baseWeight: 0.30 },
    { name: 'Língua Estrangeira (Inglês)', activityType: 'revisão', topic: 'Análise e vocabulário técnico de ocorrências policiais em Inglês/Espanhol', baseWeight: 0.30 }
  ],
  'Sexta': [
    { name: 'Legislação de Trânsito', activityType: 'teoria', topic: 'Resolução CONTRAN 432: Testes de alcoolemia e margens de erro', baseWeight: 0.40 },
    { name: 'Legislação Especial', activityType: 'teoria', topic: 'Lei de Drogas (Lei 11.343/06) e Estatuto do Desarmamento', baseWeight: 0.30 },
    { name: 'Direitos Humanos', activityType: 'revisão', topic: 'Direitos Humanos na Constituição Federal e Declaração Universal', baseWeight: 0.30 }
  ],
  'Sábado': [
    { name: 'Revisão Geral', activityType: 'revisão', topic: 'Resgate ativo do conteúdo e flashcards de fixação da semana', baseWeight: 0.50 },
    { name: 'Simulado', activityType: 'simulado', topic: 'Simulado CEBRASPE com penalidades reais (1 errada anula 1 certa)', baseWeight: 0.50 }
  ],
  'Domingo': [
    { name: 'Planejamento e Descanso Ativo', activityType: 'revisão', topic: 'Análise de métricas semanais e calibração cognitiva Athena', baseWeight: 1.00 }
  ]
};

export default function Cronograma({ schedule, onboardingData, onUpdateSchedule, onUpdateOnboardingData, theme = 'dark' }: CronogramaProps) {
  const isLight = theme === 'light';
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    discipline: string;
    duration: number;
    activityType: TaskType;
    topic: string;
    justification: string;
  } | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);
  const [recalibrateMsg, setRecalibrateMsg] = useState<string>('');

  // Daily hours map representation
  const [dailyHours, setDailyHours] = useState<Record<string, number>>(() => {
    const initialHours: Record<string, number> = {};
    schedule.weekly.forEach(day => {
      const cleanDay = day.dayOfWeek.split('-')[0];
      const totalMins = day.disciplines.reduce((sum, d) => sum + d.duration, 0);
      initialHours[cleanDay] = Math.round((totalMins / 60) * 10) / 10;
    });
    
    // Ensure all 7 days are always initialized
    const fallbackDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    fallbackDays.forEach(fd => {
      if (initialHours[fd] === undefined) {
        if (fd === 'Sábado') initialHours[fd] = 4;
        else if (fd === 'Domingo') initialHours[fd] = 2;
        else initialHours[fd] = 4;
      }
    });
    return initialHours;
  });

  // Keep daily hours updated with props from parent in case in-app recalibrations trigger
  useEffect(() => {
    const updatedHours: Record<string, number> = {};
    schedule.weekly.forEach(day => {
      const cleanDay = day.dayOfWeek.split('-')[0];
      const totalMins = day.disciplines.reduce((sum, d) => sum + d.duration, 0);
      updatedHours[cleanDay] = Math.round((totalMins / 60) * 10) / 10;
    });
    setDailyHours(prev => ({
      ...prev,
      ...updatedHours
    }));
  }, [schedule]);

  // Compute overall weekly hours
  const totalWeeksHours = Math.round((Object.values(dailyHours) as number[]).reduce((sum: number, h: number) => sum + h, 0) * 10) / 10;

  const handleOnboardingDailyHoursUpdate = (newHoursPerDay: number) => {
    const updatedHours: Record<string, number> = {
      'Segunda': newHoursPerDay,
      'Terça': newHoursPerDay,
      'Quarta': newHoursPerDay,
      'Quinta': newHoursPerDay,
      'Sexta': newHoursPerDay,
      'Sábado': Math.max(1, Math.min(12, Math.round(newHoursPerDay * 1.0 * 2) / 2)),
      'Domingo': Math.max(1, Math.min(12, Math.round(newHoursPerDay * 0.5 * 2) / 2))
    };

    setDailyHours(updatedHours);

    const updatedWeekly = schedule.weekly.map(day => {
      const cleanDay = day.dayOfWeek.split('-')[0];
      const targetHours = updatedHours[cleanDay] || 4;
      const minutes = targetHours * 60;

      if (minutes === 0) {
        return {
          ...day,
          disciplines: []
        };
      }

      let disciplines = [...day.disciplines];
      if (disciplines.length === 0) {
        const template = TEMPLATE_DISCIPLINES[cleanDay] || TEMPLATE_DISCIPLINES['Segunda'];
        disciplines = template.map(t => ({
          name: t.name,
          duration: 0,
          activityType: t.activityType,
          topic: t.topic
        }));
      }

      // Proportional math distribution
      const totalOriginalMins = disciplines.reduce((sum, d) => sum + d.duration, 0);
      if (totalOriginalMins > 0) {
        disciplines = disciplines.map(d => {
          const ratio = d.duration / totalOriginalMins;
          const duration = Math.max(20, Math.round((ratio * minutes) / 5) * 5);
          return {
            ...d,
            duration
          };
        });

        const sumAfterScale = disciplines.reduce((sum, d) => sum + d.duration, 0);
        const diff = minutes - sumAfterScale;
        if (diff !== 0 && disciplines.length > 0) {
          disciplines[0].duration = Math.max(20, disciplines[0].duration + diff);
        }
      } else {
        const template = TEMPLATE_DISCIPLINES[cleanDay] || TEMPLATE_DISCIPLINES['Segunda'];
        disciplines = disciplines.map((d, idx) => {
          const weight = template[idx]?.baseWeight || (1 / disciplines.length);
          const duration = Math.max(20, Math.round((weight * minutes) / 5) * 5);
          return {
            ...d,
            duration
          };
        });

        const sumAfterScale = disciplines.reduce((sum, d) => sum + d.duration, 0);
        const diff = minutes - sumAfterScale;
        if (diff !== 0 && disciplines.length > 0) {
          disciplines[0].duration = Math.max(20, disciplines[0].duration + diff);
        }
      }

      return {
        ...day,
        disciplines
      };
    });

    onUpdateSchedule({
      ...schedule,
      weekly: updatedWeekly
    });

    if (onUpdateOnboardingData && onboardingData) {
      onUpdateOnboardingData({
        ...onboardingData,
        hoursPerDay: newHoursPerDay
      });
    }
  };

  const handleUpdateTestDate = (newDate: string) => {
    if (onUpdateOnboardingData && onboardingData) {
      onUpdateOnboardingData({
        ...onboardingData,
        testDate: newDate
      });
    }
  };

  const handleUpdateLanguage = (newLang: 'Inglês' | 'Espanhol') => {
    if (onUpdateOnboardingData && onboardingData) {
      onUpdateOnboardingData({
        ...onboardingData,
        selectedLanguage: newLang
      });
    }
  };

  // Modify daily hour block and distribute inside the daily disciplines proportionally
  const handleUpdateHours = (cleanDay: string, newHours: number) => {
    const hours = Math.max(0, Math.min(16, Math.round(newHours * 10) / 10));
    const updatedDaily = { ...dailyHours, [cleanDay]: hours };
    setDailyHours(updatedDaily);

    const updatedWeekly = schedule.weekly.map(day => {
      const currentClean = day.dayOfWeek.split('-')[0];
      if (currentClean !== cleanDay) {
        return day;
      }

      const minutes = hours * 60;
      if (minutes === 0) {
        return {
          ...day,
          disciplines: []
        };
      }

      // If Sunday or Saturday and was 0 duration, or we simply have empty list
      let disciplines = [...day.disciplines];
      if (disciplines.length === 0) {
        const template = TEMPLATE_DISCIPLINES[currentClean] || TEMPLATE_DISCIPLINES['Segunda'];
        disciplines = template.map(t => ({
          name: t.name,
          duration: 0,
          activityType: t.activityType,
          topic: t.topic
        }));
      }

      // Proportional math distribution
      const totalOriginalMins = disciplines.reduce((sum, d) => sum + d.duration, 0);
      if (totalOriginalMins > 0) {
        disciplines = disciplines.map(d => {
          const ratio = d.duration / totalOriginalMins;
          const duration = Math.max(20, Math.round((ratio * minutes) / 5) * 5);
          return {
            ...d,
            duration
          };
        });

        // Resolve rounding offsets
        const sumAfterScale = disciplines.reduce((sum, d) => sum + d.duration, 0);
        const diff = minutes - sumAfterScale;
        if (diff !== 0 && disciplines.length > 0) {
          disciplines[0].duration = Math.max(20, disciplines[0].duration + diff);
        }
      } else {
        const template = TEMPLATE_DISCIPLINES[currentClean] || TEMPLATE_DISCIPLINES['Segunda'];
        disciplines = disciplines.map((d, idx) => {
          const weight = template[idx]?.baseWeight || (1 / disciplines.length);
          const duration = Math.max(20, Math.round((weight * minutes) / 5) * 5);
          return {
            ...d,
            duration
          };
        });

        const sumAfterScale = disciplines.reduce((sum, d) => sum + d.duration, 0);
        const diff = minutes - sumAfterScale;
        if (diff !== 0 && disciplines.length > 0) {
          disciplines[0].duration = Math.max(20, disciplines[0].duration + diff);
        }
      }

      return {
        ...day,
        disciplines
      };
    });

    onUpdateSchedule({
      ...schedule,
      weekly: updatedWeekly
    });
  };

  // Adjust total hours and scale each day of the week accordingly
  const handleUpdateTotalHours = (newTotal: number) => {
    const total = Math.max(1, Math.min(112, Math.round(newTotal * 10) / 10));
    const currentTotal = (Object.values(dailyHours) as number[]).reduce((sum: number, h: number) => sum + h, 0) || 28;
    const scale = total / currentTotal;

    const updatedDaily: Record<string, number> = {};
    const updatedWeekly = schedule.weekly.map(day => {
      const cleanDay = day.dayOfWeek.split('-')[0];
      const originalHours = dailyHours[cleanDay] || 4;
      const newDayHours = Math.round((originalHours * scale) * 10) / 10;
      updatedDaily[cleanDay] = newDayHours;

      const minutes = newDayHours * 60;
      if (minutes === 0) {
        return {
          ...day,
          disciplines: []
        };
      }

      let disciplines = [...day.disciplines];
      if (disciplines.length === 0) {
        const template = TEMPLATE_DISCIPLINES[cleanDay] || TEMPLATE_DISCIPLINES['Segunda'];
        disciplines = template.map(t => ({
          name: t.name,
          duration: 0,
          activityType: t.activityType,
          topic: t.topic
        }));
      }

      const totalOriginalMins = disciplines.reduce((sum, d) => sum + d.duration, 0);
      if (totalOriginalMins > 0) {
        disciplines = disciplines.map(d => {
          const ratio = d.duration / totalOriginalMins;
          const duration = Math.max(20, Math.round((ratio * minutes) / 5) * 5);
          return {
            ...d,
            duration
          };
        });

        const sumAfterScale = disciplines.reduce((sum, d) => sum + d.duration, 0);
        const diff = minutes - sumAfterScale;
        if (diff !== 0 && disciplines.length > 0) {
          disciplines[0].duration = Math.max(20, disciplines[0].duration + diff);
        }
      } else {
        const template = TEMPLATE_DISCIPLINES[cleanDay] || TEMPLATE_DISCIPLINES['Segunda'];
        disciplines = disciplines.map((d, idx) => {
          const weight = template[idx]?.baseWeight || (1 / disciplines.length);
          const duration = Math.max(20, Math.round((weight * minutes) / 5) * 5);
          return {
            ...d,
            duration
          };
        });

        const sumAfterScale = disciplines.reduce((sum, d) => sum + d.duration, 0);
        const diff = minutes - sumAfterScale;
        if (diff !== 0 && disciplines.length > 0) {
          disciplines[0].duration = Math.max(20, disciplines[0].duration + diff);
        }
      }

      return {
        ...day,
        disciplines
      };
    });

    setDailyHours(updatedDaily);
    onUpdateSchedule({
      ...schedule,
      weekly: updatedWeekly
    });
  };

  const handeRecalibrate = async () => {
    setIsRecalibrating(true);
    setRecalibrateMsg('Analisando seu desempenho CEBRASPE recente...');
    
    setTimeout(() => {
      setRecalibrateMsg('Mapeando fraquezas em Direito Penal e Física...');
    }, 1200);

    setTimeout(() => {
      setRecalibrateMsg('Distribuindo sessões prioritárias de CTB/Multas...');
    }, 2400);

    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding: { ...onboardingData, hoursPerDay: totalWeeksHours / 7 } }),
      });
      const data = await response.json();
      onUpdateSchedule(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecalibrating(false);
      setRecalibrateMsg('');
    }
  };

  const getSlotJustification = (name: string, type: TaskType, topic: string) => {
    const prfOfficerPhrases = [
      `Concurseiro(a), o bloco de **Legislação de Trânsito** representa o maior contingente de questões no edital da PRF. Colocamos esta sessão focada em "${topic}" para alternar o estudo teórico com a fixação de resoluções de trânsito de alta relevância no CTB.`,
      `Estudos mostram que ciclos inteligentes recomendam revisões rápidas em matérias complexas como **${name}** para blindar seu aproveitamento contra as armadilhas clássicas de troca de conceitos da CEBRASPE.`,
      `Esta alocação cumpre o edital verticalizado. Intercalamos temas de alta abstração como Direito Constitucional com disciplinas de peso estratégico para otimizar sua absorção de estudos durante as horas configuradas para o respectivo dia.`
    ];
    
    if (name.includes('Trânsito')) return prfOfficerPhrases[0];
    if (type === 'revisão' || type === 'questões') return prfOfficerPhrases[1];
    return prfOfficerPhrases[2];
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8" id="cronograma-view-container">
      
      {/* 1. HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs text-emerald-400 font-mono tracking-widest font-semibold uppercase">METODOLOGIA ADAPTATIVA ATHENA</span>
          <h2 className="text-2xl font-black text-white leading-tight">Cronograma Mapeado pela Athena</h2>
          <p className="text-xs text-slate-400 mt-1">
            Plano adaptativo distribuído para o concurso de **{onboardingData?.role === 'PRF' ? 'Policial Rodoviário Federal (PRF)' : (onboardingData?.role || 'PRF')}**.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-850 flex items-center shrink-0">
            <button
              onClick={() => setViewType('weekly')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                viewType === 'weekly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                viewType === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Mensal
            </button>
          </div>

          <button
            onClick={handeRecalibrate}
            disabled={isRecalibrating}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-yellow-500 hover:text-yellow-400 hover:border-yellow-500/25 hover:bg-slate-900 transition-all disabled:opacity-45 cursor-pointer"
            id="btn-recalibrate-cronograma"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin text-emerald-500' : ''}`} />
            Recalibrar IA
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-slate-750 hover:bg-slate-900 transition-all cursor-pointer"
            id="btn-settings-cronograma"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Configurar Carga</span>
          </button>
        </div>
      </div>

      {isRecalibrating && (
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl text-center space-y-4 animate-pulse">
          <RefreshCw className="w-8 h-8 text-yellow-500 animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-300">{recalibrateMsg}</p>
          <p className="text-xs text-slate-500">A Athena está recalculando a carga do edital...</p>
        </div>
      )}



      {/* 3. WEEKLY VIEW (GRID OF BIGGER AND MUCH MORE DISTINCT DAY CARDS) */}
      {!isRecalibrating && viewType === 'weekly' && (
        <div className="space-y-6 animate-fade-in text-left" id="weekly-view-grid">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {schedule.weekly.map((day, dIdx) => {
              const cleanDay = day.dayOfWeek.split('-')[0];
              const totalMins = day.disciplines.reduce((sum, d) => sum + d.duration, 0);
              const totalHrs = Math.round((totalMins / 60) * 10) / 10;
              const isWeekend = cleanDay === 'Sábado' || cleanDay === 'Domingo';

              return (
                <div 
                  key={day.dayOfWeek} 
                  className={`bg-slate-950 rounded-2xl border flex flex-col justify-between overflow-hidden shadow-2xl transition-all ${
                    isWeekend 
                      ? 'border-amber-500/15 bg-gradient-to-b from-[#0e1326] to-slate-950' 
                      : 'border-slate-850 hover:border-slate-800'
                  }`}
                >
                  {/* Card head: Larger and much more distinct */}
                  <div className={`p-4 border-b border-slate-900 flex items-center justify-between ${
                    isWeekend ? 'bg-amber-500/[0.02]' : 'bg-slate-900/10'
                  }`}>
                    <div>
                      <h4 className={`text-base font-black uppercase tracking-wider font-sans ${
                        isWeekend ? 'text-amber-400' : 'text-slate-100'
                      }`}>
                        {cleanDay === 'Sábado' ? 'Sábado' : cleanDay === 'Domingo' ? 'Domingo' : `${cleanDay}-feira`}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5 uppercase tracking-widest font-bold">
                        {isWeekend ? 'Consolidação e Simulados' : 'Estudo de Matérias'}
                      </p>
                    </div>

                    <span className={`px-2 py-1 rounded-md text-[10.5px] font-mono font-bold border shrink-0 ${
                      totalHrs === 0 
                        ? 'bg-emerald-950/20 text-emerald-400 border-emerald-950' 
                        : 'bg-slate-900 text-slate-300 border-slate-850'
                    }`}>
                      {totalHrs === 0 ? '✨ Desintoxicação' : `⏱️ ${totalHrs}h`}
                    </span>
                  </div>

                  {/* Body disciplines list */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    {day.disciplines.length === 0 ? (
                      <div className="py-10 px-4 my-auto bg-slate-900/20 rounded-xl border border-dashed border-slate-850 text-center space-y-2 flex flex-col items-center justify-center">
                        <span className="text-2xl animate-bounce">🏝️</span>
                        <h5 className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">Descanso Estratégico</h5>
                        <p className="text-[10.5px] text-slate-500 leading-normal max-w-[200px] mx-auto">
                          Sem carga horária declarada para este dia. Aproveite para descansar a mente ou revisar flashcards.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {day.disciplines.map((disc, subIdx) => (
                          <div 
                            key={subIdx}
                            onClick={() => setSelectedSlot({
                              day: day.dayOfWeek,
                              discipline: disc.name,
                              duration: disc.duration,
                              activityType: disc.activityType,
                              topic: disc.topic,
                              justification: getSlotJustification(disc.name, disc.activityType, disc.topic)
                            })}
                            className="group p-3.5 rounded-xl bg-slate-905 border border-slate-850/80 hover:border-amber-500/40 hover:bg-slate-900 cursor-pointer transition-all space-y-2.5 text-left relative overflow-hidden"
                            id={`fc-discipline-${dIdx}-${subIdx}`}
                          >
                            {/* Accent highlight strip */}
                            <div className={`absolute top-0 bottom-0 left-0 w-[3px] transition-all ${
                              disc.activityType === 'teoria' ? 'bg-blue-500' :
                              disc.activityType === 'questões' ? 'bg-yellow-500' :
                              disc.activityType === 'revisão' ? 'bg-purple-500' :
                              'bg-red-500'
                            }`} />

                            <div className="flex justify-between items-start gap-1 pl-1">
                              <span className="text-xs font-extrabold text-[#ededed] group-hover:text-amber-450 group-hover:text-amber-400 transition-colors truncate">
                                {disc.name}
                              </span>
                              
                              <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold shrink-0 uppercase tracking-widest ${
                                disc.activityType === 'teoria' ? 'bg-blue-950/60 text-blue-400 border border-blue-900/30' :
                                disc.activityType === 'questões' ? 'bg-yellow-950/60 text-yellow-400 border border-yellow-900/30' :
                                disc.activityType === 'revisão' ? 'bg-purple-950/60 text-purple-400 border border-purple-900/30' :
                                'bg-red-950/60 text-red-400 border border-red-900/30'
                              }`}>
                                {disc.activityType === 'teoria' ? 'Teoria' :
                                 disc.activityType === 'questões' ? 'Exercicios' :
                                 disc.activityType === 'revisão' ? 'Revisar' : 'Simulado'}
                              </span>
                            </div>

                            {/* Detailed Topic line: showing directly inside the card to look structured and realistic */}
                            <p className="text-[11px] text-slate-400 leading-normal pl-1 line-clamp-2">
                              {disc.topic}
                            </p>

                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900/60 pt-2 pl-1 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {disc.duration} min
                              </span>
                              <span className="text-[9.5px] text-slate-500 group-hover:text-amber-400 group-hover:underline flex items-center gap-0.5">
                                Analisar alocação ➝
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Day aggregate info */}
                    <div className="text-[10px] text-slate-600 font-mono text-center pt-2.5 border-t border-slate-900 flex justify-between items-center sm:px-2">
                      <span>Ciclo Ativo</span>
                      <span>{day.disciplines.length} matérias</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 leading-normal">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Dica: Clique em qualquer bloco de matéria para ver a <b>justificativa da Athena</b> detalhada para aquela alocação semanal.</span>
            </span>
            <span className="text-[10.5px] font-mono text-slate-500 shrink-0">Última recalibração: {schedule.lastRecalibrated || '2026-05-22'}</span>
          </div>
        </div>
      )}

      {/* 4. MONTHLY VIEW (CYCLE HIGHLIGHTS) */}
      {!isRecalibrating && viewType === 'monthly' && (
        <div className="space-y-4 animate-fade-in text-left text-xs sm:text-xs" id="monthly-view-list">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {schedule.monthly.map((week) => (
              <div key={week.weekIndex} className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <span className="text-xs font-mono font-bold text-emerald-400">SEMANA {week.weekIndex}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-2">{week.theme}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Ciclo focado em cobrir e consolidar revisões dos tópicos macros de maior incidência no CEBRASPE.</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Disciplinas em Foco</span>
                  <div className="flex flex-wrap gap-1.5">
                    {week.focusDisciplines.map((fd, fIdx) => (
                      <span key={fIdx} className="bg-slate-900 border border-slate-850 text-slate-300 text-[10px] px-2 py-0.5 rounded-md">
                        {fd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SLOT COMPREHENSIVE DETAIL MODAL */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${
            isLight ? 'bg-white border-slate-205 border-slate-200 shadow-xl' : 'bg-slate-900 border-amber-500/30'
          } border max-w-md w-full rounded-2xl p-6 shadow-2xl relative animate-scale-up text-left`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 text-xl font-bold">
                🦉
              </div>
              <div className="min-w-0">
                <dt className="text-xs uppercase font-mono tracking-widest text-[#d97706] dark:text-amber-400 font-bold">{selectedSlot.day}</dt>
                <h3 className={`text-base sm:text-lg font-bold leading-tight mt-0.5 truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{selectedSlot.discipline}</h3>
                <span className={`text-xs font-mono italic block truncate ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>Tópico: {selectedSlot.topic}</span>
              </div>
            </div>

            <div className={`p-4 border rounded-xl mb-6 text-xs sm:text-sm leading-relaxed italic ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-700' 
                : 'bg-slate-950/90 border-slate-800 text-slate-350'
            }`}>
              "{selectedSlot.justification}"
            </div>

            <div className={`flex items-center justify-between text-xs font-mono mb-4 border-b pb-4 ${
              isLight ? 'text-slate-600 border-slate-100' : 'text-slate-500 border-slate-900'
            }`}>
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5" /> Duração: {selectedSlot.duration} minutos
              </span>
              <span className={`px-2.5 py-0.5 rounded uppercase text-[9.5px] border ${
                isLight 
                  ? 'bg-amber-50 border-amber-100 text-[#b45309] font-bold' 
                  : 'bg-slate-950 border-white/[0.04] text-amber-400'
              }`}>{selectedSlot.activityType}</span>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSelectedSlot(null)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs hover:scale-[1.01] transition-transform cursor-pointer"
              >
                Entendido, avançar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAÇÃO SIMPLIFICADA */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="settings-popup-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative text-left my-8 animate-scale-up">
            
            {/* Top Close Icon Button */}
            <button 
              type="button" 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-855 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer animate-fade-in inline-flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono tracking-widest text-[#F59E0B] font-extrabold uppercase">
                Painel do Planejamento
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Configurações de Carga Horária
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
                Faça o ajuste fino da sua rotina de estudos. A Athena adequará seu cronograma automaticamente em tempo real.
              </p>
            </div>

            {/* Simplified Settings Content inside Modal */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1" id="simplified-settings-modal-body">
              
              {/* SECTION 1: Carga Diária Geral */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-850/60">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase text-slate-300 font-extrabold tracking-wider">
                    ⚡ Tempo de Estudo Geral
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/10 px-2 py-0.5 rounded">
                    {onboardingData?.hoursPerDay || 4}h por dia na média
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={onboardingData?.hoursPerDay || 4}
                  onChange={(e) => handleOnboardingDailyHoursUpdate(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />

                {/* Quick Presets row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { val: 1, label: '1h Manutenção' },
                    { val: 4, label: '4h Padrão' },
                    { val: 10, label: '10h Imersão' }
                  ].map((p) => {
                    const isActive = onboardingData?.hoursPerDay === p.val;
                    return (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => handleOnboardingDailyHoursUpdate(p.val)}
                        className={`py-2 px-2 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md' 
                            : 'bg-slate-900 text-slate-400 border border-slate-800/80 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Data Limit e Idioma */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850/60 space-y-2">
                  <label className="text-xs font-mono uppercase text-slate-300 font-extrabold tracking-wider flex items-center gap-1.5 bg-transparent border-0">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Limite para a Prova
                  </label>
                  <input 
                    type="date"
                    value={onboardingData?.testDate || '2026-12-15'}
                    onChange={(e) => handleUpdateTestDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850/60 space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-300 font-extrabold tracking-wider block">
                    🌐 Idioma da Prova
                  </span>
                  <div className="flex gap-2">
                    {['Inglês', 'Espanhol'].map((lang) => {
                      const isSelected = onboardingData?.selectedLanguage === lang;
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleUpdateLanguage(lang as any)}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            isSelected 
                              ? 'bg-[#1b263e]/60 border-amber-500 text-amber-400 font-black' 
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* SECTION 3: Multiplicador Semanal */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                    📈 Multiplicador Semanal
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Ajusta proporcionalmente todos os blocos do cronograma.
                  </p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 p-2 py-1.5 rounded-lg flex items-center gap-3 min-w-[200px]">
                  <span className="text-xs font-mono font-bold text-white shrink-0">
                    {totalWeeksHours}h / sem
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="70"
                    step="1"
                    value={Math.round(totalWeeksHours)}
                    onChange={(e) => handleUpdateTotalHours(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* SECTION 4: Day by Day fine tune */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-slate-300 font-extrabold tracking-wider block">
                  ⚙️ Diária Ajustada (Segunda a Domingo)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((cleanDay) => {
                    const hours = dailyHours[cleanDay] || 0;
                    const isWeekend = cleanDay === 'Sábado' || cleanDay === 'Domingo';
                    return (
                      <div 
                        key={cleanDay} 
                        className={`bg-slate-950 border p-2 py-3 rounded-xl text-center flex flex-col justify-between space-y-2 transition-all ${
                          hours === 0 ? 'border-dashed border-emerald-990 bg-emerald-950/5' : 'border-slate-850'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-extrabold uppercase ${
                          isWeekend ? 'text-amber-500' : 'text-slate-400'
                        }`}>
                          {cleanDay.slice(0, 3)}
                        </span>
                        
                        <div className="font-mono text-xs font-black text-white">
                          {hours === 0 ? (
                            <span className="text-[9px] px-1 bg-emerald-950/40 text-emerald-400 font-bold uppercase rounded">Folga</span>
                          ) : (
                            `${hours}h`
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateHours(cleanDay, hours - 0.5)}
                            className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateHours(cleanDay, hours + 0.5)}
                            className="w-5 h-5 bg-slate-900 hover:bg-amber-500 text-amber-500 hover:text-slate-950 rounded flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button 
                type="button" 
                onClick={() => setShowSettings(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg active:scale-[0.98]"
              >
                Salvar e Aplicar Carga
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
