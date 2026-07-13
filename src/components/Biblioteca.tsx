import React, { useState } from 'react';
import { LibraryItem, Question } from '../types';
import { FolderPlus, FileText, Youtube, CheckCircle2, ChevronRight, Loader2, Sparkles, Check, X, Plus, ArrowLeft, Link2, AlertTriangle } from 'lucide-react';

interface BibliotecaProps {
  library: LibraryItem[];
  onAddLibraryItem: (item: LibraryItem) => void;
  onQuestionAnswered: (isCorrect: boolean, discipline: string) => void;
  theme?: 'dark' | 'light';
}

const typeIcon = (type: string) => {
  if (type === 'Link YouTube') return <Youtube className="w-4 h-4 text-red-500" />;
  return <FileText className="w-4 h-4 text-indigo-500" />;
};
const typePill: Record<string, string> = {
  'PDF':         'bg-indigo-500/10 border-indigo-500/20 text-indigo-500',
  'Anotação':    'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
  'Link YouTube':'bg-red-500/10 border-red-500/20 text-red-500',
  'Apostila':    'bg-amber-500/10 border-amber-500/20 text-amber-600',
};

export default function Biblioteca({ library, onAddLibraryItem, onQuestionAnswered, theme = 'dark' }: BibliotecaProps) {
  const d = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'catalog' | 'add' | 'drive'>('catalog');
  const [driveUrl, setDriveUrl] = useState('');
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveResult, setDriveResult] = useState<{ fileName: string; textContent: string; warning?: string } | null>(null);
  const [driveError, setDriveError] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'PDF' | 'Anotação' | 'Link YouTube' | 'Apostila'>('Anotação');
  const [analyzingFile, setAnalyzingFile] = useState<LibraryItem | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ summary: string; keyPoints: string[]; athenaQuestion: Question } | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [userAnswer, setUserAnswer] = useState<'C' | 'E' | null>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState(false);

  const handleFetchDrive = async () => {
    if (!driveUrl.trim()) return;
    setDriveLoading(true);
    setDriveError('');
    setDriveResult(null);
    try {
      const apiKey = localStorage.getItem('provax_google_api_key') || 'AIzaSyCflyHQfNnXdt5TsXmN_nR0FBm8meEmk-M';
      const res = await fetch('/api/fetch-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: driveUrl, apiKey }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setDriveError(data.error || 'Erro ao acessar o arquivo.');
      } else {
        setDriveResult(data);
      }
    } catch (e: any) {
      setDriveError('Falha de conexão. Tente novamente.');
    } finally {
      setDriveLoading(false);
    }
  };

  const handleImportFromDrive = () => {
    if (!driveResult) return;
    onAddLibraryItem({
      id: `drive-${Date.now()}`,
      title: driveResult.fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${Math.round(driveResult.textContent.length / 1024 * 10) / 10} KB`,
      content: driveResult.textContent,
      type: 'PDF',
    });
    setDriveUrl('');
    setDriveResult(null);
    setActiveTab('catalog');
  };

  const handleCreateDocument = () => {
    if (!materialTitle.trim() || !pastedText.trim()) return;
    onAddLibraryItem({ id: `lib-${Date.now()}`, title: materialTitle, uploadDate: new Date().toISOString().split('T')[0], fileSize: `${Math.round(pastedText.length / 1024 * 10) / 10} KB`, content: pastedText, type: materialType });
    setMaterialTitle(''); setPastedText(''); setActiveTab('catalog');
  };
  const handleStartAnalysis = async (item: LibraryItem) => {
    setAnalyzingFile(item); setAnalysisResult(null); setAnsweredQuestion(false); setUserAnswer(null); setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/analyze-library', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: item.title, textContent: item.content }) });
      setAnalysisResult(await res.json());
    } catch { } finally { setLoadingAnalysis(false); }
  };
  const handleCheckAnswer = () => {
    if (!analysisResult || !userAnswer || answeredQuestion) return;
    setAnsweredQuestion(true);
    onQuestionAnswered(userAnswer === analysisResult.athenaQuestion.correctAnswer, 'Legislação de Trânsito');
  };

  // Tokens de tema
  const pg       = d ? 'bg-[#080b14]'  : 'bg-slate-50';
  const cardCls  = d ? 'bg-[#0d1117] border border-white/[0.06]' : 'bg-white border border-slate-200 shadow-sm';
  const raised   = d ? 'bg-[#131a27]'  : 'bg-slate-50';
  const txt      = d ? 'text-white'    : 'text-slate-900';
  const mut      = d ? 'text-slate-400': 'text-slate-500';
  const fnt      = d ? 'text-slate-500': 'text-slate-400';
  const bdr      = d ? 'border-white/[0.06]' : 'border-slate-200';
  const inp      = d
    ? 'bg-[#131a27] border border-white/[0.08] focus:border-indigo-500/60 text-white placeholder-slate-600'
    : 'bg-white border border-slate-200 focus:border-indigo-400 text-slate-900 placeholder-slate-400';
  const tabActive = d ? 'bg-white/[0.08] text-white' : 'bg-indigo-50 text-indigo-700';
  const tabIdle   = d ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700';
  const itemCard  = d ? 'bg-[#0d1117] border border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm';
  const iconBox   = d ? 'bg-white/[0.04] border border-white/[0.06]' : 'bg-slate-100 border border-slate-200';

  return (
    <div className={`min-h-full ${pg} font-sans`}>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${txt}`}>Seus Materiais</h1>
            <p className={`text-sm mt-0.5 ${mut}`}>Suba PDFs ou anotações e receba questões geradas pela Athena.</p>
          </div>
          <button onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all hover:scale-[1.02] cursor-pointer shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> Adicionar Material
          </button>
        </div>

        {/* Tabs */}
        {!analyzingFile && (
          <div className={`flex gap-1 ${d ? 'bg-[#0d1117] border border-white/[0.06]' : 'bg-white border border-slate-200 shadow-sm'} p-1 rounded-xl w-fit`}>
            {[{ id: 'catalog', label: `Catálogo (${library.length})` }, { id: 'add', label: 'Novo Material' }].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === t.id ? tabActive : tabIdle}`}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Catálogo */}
        {activeTab === 'catalog' && !analyzingFile && (
          <div>
            {library.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className={`w-14 h-14 rounded-2xl ${iconBox} flex items-center justify-center`}>
                  <FolderPlus className={`w-6 h-6 ${fnt}`} />
                </div>
                <div>
                  <p className={`font-bold ${txt}`}>Biblioteca vazia</p>
                  <p className={`text-sm mt-1 ${mut}`}>Adicione seu primeiro material para começar.</p>
                </div>
                <button onClick={() => setActiveTab('add')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer">
                  Adicionar Material
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {library.map(item => (
                  <div key={item.id} className={`${itemCard} rounded-2xl p-4 flex items-center gap-3 transition-all`}>
                    <div className={`w-10 h-10 rounded-xl ${iconBox} flex items-center justify-center shrink-0`}>
                      {typeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${txt}`}>{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${typePill[item.type] || typePill['PDF']}`}>{item.type}</span>
                        <span className={`text-[10px] ${fnt}`}>{item.fileSize || 'N/A'} · {item.uploadDate}</span>
                      </div>
                    </div>
                    <button onClick={() => handleStartAnalysis(item)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer">
                      <Sparkles className="w-3 h-3" /> Analisar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Análise */}
        {analyzingFile && (
          <div className="space-y-5">
            <button onClick={() => { setAnalyzingFile(null); setAnalysisResult(null); }}
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${d ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar
            </button>
            <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              📄 {analyzingFile.title}
            </span>

            {loadingAnalysis && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className={`text-sm font-mono ${mut}`}>Athena fazendo leitura hermenêutica...</p>
              </div>
            )}

            {!loadingAnalysis && analysisResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`${cardCls} rounded-2xl p-5`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${fnt}`}>Resumo</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${d ? 'text-slate-300' : 'text-slate-700'}`}>{analysisResult.summary}</p>
                  </div>
                  <div className={`${cardCls} rounded-2xl p-5`}>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${fnt} block mb-3`}>Pontos-Chave</span>
                    <ul className="space-y-2">
                      {analysisResult.keyPoints.map((kp, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${d ? 'text-slate-300' : 'text-slate-700'}`}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{kp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`${d ? 'bg-[#0d1117]' : 'bg-white shadow-sm'} border border-amber-500/20 rounded-2xl p-5 space-y-4`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">Questão Autoral · Athena AI</span>
                    <span className={`text-[9px] ${fnt} font-mono`}>{analysisResult.athenaQuestion.discipline}</span>
                  </div>
                  <p className={`text-sm leading-relaxed font-medium ${txt}`}>{analysisResult.athenaQuestion.statement}</p>

                  {!answeredQuestion ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {(['C', 'E'] as const).map(ans => (
                          <button key={ans} onClick={() => setUserAnswer(ans)}
                            className={`py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                              userAnswer === ans
                                ? ans === 'C' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600' : 'bg-red-500/20 border-red-500 text-red-500'
                                : d ? 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:border-white/[0.15]' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}>
                            {ans === 'C' ? 'Certo' : 'Errado'}
                          </button>
                        ))}
                      </div>
                      <button onClick={handleCheckAnswer} disabled={!userAnswer}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          userAnswer ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                          : d ? 'bg-white/[0.04] text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}>
                        Confirmar Resposta
                      </button>
                    </div>
                  ) : (
                    <div className={`rounded-xl p-4 border ${
                      userAnswer === analysisResult.athenaQuestion.correctAnswer
                        ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <p className={`text-sm font-bold mb-2 ${userAnswer === analysisResult.athenaQuestion.correctAnswer ? 'text-emerald-600' : 'text-red-500'}`}>
                        {userAnswer === analysisResult.athenaQuestion.correctAnswer ? '✓ Acertou!' : '✗ Errou!'}
                        {' '}Gabarito: <span className="text-amber-500">{analysisResult.athenaQuestion.correctAnswer === 'C' ? 'Certo' : 'Errado'}</span>
                      </p>
                      <p className={`text-xs leading-relaxed ${d ? 'text-slate-300' : 'text-slate-600'}`}>
                        <b>Athena:</b> {analysisResult.athenaQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Google Drive ─────────────────────────────── */}
        {activeTab === 'drive' && !analyzingFile && (
          <div className={`${cardCls} rounded-2xl p-6 space-y-5 max-w-2xl`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl">
                📂
              </div>
              <div>
                <h2 className={`text-base font-black ${txt}`}>Importar do Google Drive</h2>
                <p className={`text-xs mt-0.5 ${mut}`}>Cole o link de compartilhamento do arquivo ou pasta</p>
              </div>
            </div>

            {/* Instruções */}
            <div className={`rounded-xl p-3 text-xs space-y-1 ${d ? 'bg-green-500/5 border border-green-500/15' : 'bg-green-50 border border-green-200'}`}>
              <p className="font-bold text-green-500">Requisito: arquivo deve ser público</p>
              <p className={mut}>No Drive: clique em Compartilhar → "Qualquer pessoa com o link" → Copiar link</p>
              <p className={`text-[10px] ${fnt}`}>Suportado: Google Docs, Google Sheets, arquivos .txt · PDF requer conversão para Doc</p>
            </div>

            {/* Input de URL */}
            <div>
              <label className={`block text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 ${fnt}`}>Link do Google Drive</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={driveUrl}
                  onChange={e => { setDriveUrl(e.target.value); setDriveError(''); setDriveResult(null); }}
                  placeholder="https://drive.google.com/file/d/... ou https://docs.google.com/document/d/..."
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inp}`}
                />
                <button
                  onClick={handleFetchDrive}
                  disabled={driveLoading || !driveUrl.trim()}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    driveUrl.trim() && !driveLoading
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
                      : d ? 'bg-white/[0.04] text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {driveLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</> : <><Link2 className="w-4 h-4" /> Buscar</>}
                </button>
              </div>
            </div>

            {/* Erro */}
            {driveError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{driveError}</p>
              </div>
            )}

            {/* Resultado */}
            {driveResult && (
              <div className={`rounded-xl p-4 space-y-3 border ${d ? 'bg-[#131a27] border-white/[0.06]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-bold ${txt}`}>📄 {driveResult.fileName}</p>
                    <p className={`text-[10px] font-mono mt-0.5 ${fnt}`}>
                      {driveResult.textContent.length.toLocaleString()} caracteres extraídos
                    </p>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-lg">
                    ✓ Pronto
                  </span>
                </div>

                {driveResult.warning && (
                  <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-400">{driveResult.warning}</p>
                  </div>
                )}

                {/* Preview */}
                <div className={`rounded-lg p-3 text-[11px] font-mono leading-relaxed max-h-32 overflow-y-auto ${d ? 'bg-[#0a0d1a] text-slate-400' : 'bg-white text-slate-600 border border-slate-200'}`}>
                  {driveResult.textContent.slice(0, 500)}
                  {driveResult.textContent.length > 500 && <span className={fnt}>... (truncado no preview)</span>}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { setDriveResult(null); setDriveUrl(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${d ? 'border-white/[0.08] text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-800'}`}>
                    Cancelar
                  </button>
                  <button onClick={handleImportFromDrive}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Importar para Biblioteca
                  </button>
                </div>
              </div>
            )}

            {!driveResult && !driveError && (
              <button onClick={() => setActiveTab('catalog')}
                className={`text-sm font-semibold transition-all cursor-pointer ${d ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                ← Voltar ao catálogo
              </button>
            )}
          </div>
        )}

        {/* Novo Material */}
        {activeTab === 'add' && !analyzingFile && (
          <div className={`${cardCls} rounded-2xl p-6 space-y-5 max-w-2xl`}>
            <h2 className={`text-base font-black ${txt}`}>Novo Material</h2>
            <div>
              <label className={`block text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 ${fnt}`}>Título</label>
              <input type="text" value={materialTitle} onChange={e => setMaterialTitle(e.target.value)}
                placeholder="Ex: Resumo de Poderes Administrativos"
                className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inp}`} />
            </div>
            <div>
              <label className={`block text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 ${fnt}`}>Tipo</label>
              <select value={materialType} onChange={e => setMaterialType(e.target.value as any)}
                className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inp}`}>
                <option value="Anotação">Anotação</option>
                <option value="PDF">PDF</option>
                <option value="Apostila">Apostila</option>
                <option value="Link YouTube">Link YouTube</option>
              </select>
            </div>
            <div>
              <label className={`block text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 ${fnt}`}>Conteúdo</label>
              <textarea value={pastedText} onChange={e => setPastedText(e.target.value)}
                placeholder="Cole artigos do CTB, resumos teóricos ou texto principal aqui..." rows={7}
                className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none ${inp}`} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${d ? 'border-white/[0.08] hover:bg-white/[0.04] text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900'}`}>
                Cancelar
              </button>
              <button onClick={handleCreateDocument} disabled={!materialTitle.trim() || !pastedText.trim()}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  materialTitle.trim() && pastedText.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02]'
                    : d ? 'bg-white/[0.04] text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}>
                Salvar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
