import React, { useState } from 'react';
import { LibraryItem, Question } from '../types';
import { BookOpen, FolderPlus, FileText, Youtube, CheckCircle2, ChevronRight, Loader2, Sparkles, Check, X } from 'lucide-react';

interface BibliotecaProps {
  library: LibraryItem[];
  onAddLibraryItem: (item: LibraryItem) => void;
  onQuestionAnswered: (isCorrect: boolean, discipline: string) => void;
}

export default function Biblioteca({ library, onAddLibraryItem, onQuestionAnswered }: BibliotecaProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'add'>('catalog');
  const [pastedText, setPastedText] = useState<string>('');
  const [materialTitle, setMaterialTitle] = useState<string>('');
  const [materialType, setMaterialType] = useState<'PDF' | 'Anotação' | 'Link YouTube' | 'Apostila'>('Anotação');
  
  // Analytics State
  const [analyzingFile, setAnalyzingFile] = useState<LibraryItem | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    keyPoints: string[];
    athenaQuestion: Question;
  } | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);

  // Response of custom question
  const [userAnswer, setUserAnswer] = useState<'C' | 'E' | null>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState<boolean>(false);

  const handleCreateDocument = () => {
    if (!materialTitle.trim() || !pastedText.trim()) return;

    const newItem: LibraryItem = {
      id: `lib-${Date.now()}`,
      title: materialTitle,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${Math.round(pastedText.length / 1024 * 10) / 10} KB`,
      content: pastedText,
      type: materialType
    };

    onAddLibraryItem(newItem);
    setMaterialTitle('');
    setPastedText('');
    setActiveTab('catalog');
  };

  const handleStartAnalysis = async (item: LibraryItem) => {
    setAnalyzingFile(item);
    setAnalysisResult(null);
    setAnsweredQuestion(false);
    setUserAnswer(null);
    setLoadingAnalysis(true);

    try {
      const response = await fetch('/api/analyze-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: item.title, textContent: item.content }),
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (e) {
      console.error('Error analyzing document:', e);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleCheckCustomAnswer = () => {
    if (!analysisResult || !userAnswer || answeredQuestion) return;
    setAnsweredQuestion(true);
    const correct = userAnswer === analysisResult.athenaQuestion.correctAnswer;
    onQuestionAnswered(correct, 'Legislação de Trânsito');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="biblioteca-view-wrapper">
      
      {/* Header catalog selector */}
      <div className="flex border-b border-slate-800 pb-3 justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <span className="text-xs text-emerald-400 font-mono tracking-widest font-semibold uppercase">BIBLIOTECA INTELIGENTE</span>
          <h2 className="text-xl font-extrabold text-white">Seus Materiais Analisados por IA</h2>
          <p className="text-xs text-slate-405 mt-0.5 text-slate-400">Suba PDFs ou anotações e tenha questões autorais criadas pela Athena baseadas nos tópicos enviados.</p>
        </div>

        <div className="bg-slate-950 p-1 rounded-lg border border-slate-850 flex items-center">
          <button
            onClick={() => { setActiveTab('catalog'); setAnalyzingFile(null); setAnalysisResult(null); }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-colors ${
              activeTab === 'catalog' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Seu Catálogo ({library.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-colors ${
              activeTab === 'add' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            id="tab-add-library-item"
          >
            Adicionar Material
          </button>
        </div>
      </div>

      {/* CATALOG PREVIEW LIST */}
      {activeTab === 'catalog' && !analyzingFile && (
        <div className="space-y-4 animate-fade-in" id="catalog-list-view">
          {library.length === 0 ? (
            <div className="text-center py-12 text-slate-500" id="catalog-empty-wrapper">
              <FolderPlus className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p>Sua biblioteca está vazia.</p>
              <button
                onClick={() => setActiveTab('add')}
                className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-xs font-mono font-bold text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
              >
                Cadastrar Seu Primeiro PDF
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="catalog-grid-items">
              {library.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-slate-950 border border-slate-850 rounded-xl hover:border-slate-700/80 transition-all flex justify-between items-center gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg text-emerald-400">
                      {item.type === 'Link YouTube' ? <Youtube className="w-5 h-5 text-red-500" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-white text-xs sm:text-sm truncate leading-snug">{item.title}</h4>
                      <p className="text-[10px] font-mono text-slate-500 leading-normal">{item.type} • {item.fileSize || 'N/A'} • Enviado: {item.uploadDate}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartAnalysis(item)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-yellow-500 hover:text-yellow-400 rounded-lg shrink-0 flex items-center gap-1 transition-colors border border-slate-850"
                  >
                    Análise IA <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOCK / STAGE SHOWING ACTIVE SUMMARY REVIEWS */}
      {analyzingFile && (
        <div className="space-y-6 animate-scale-up" id="running-analysis-pane">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              onClick={() => { setAnalyzingFile(null); setAnalysisResult(null); }}
              className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5 transition-colors"
            >
              ← Voltar ao Catálogo
            </button>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-900/30 px-3 py-1 rounded-full font-bold">
              Material: {analyzingFile.title}
            </span>
          </div>

          {loadingAnalysis && (
            <div className="text-center py-16 space-y-4" id="analysis-loading-pane animate-pulse">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto" />
              <p className="text-sm font-mono text-slate-300">A Athena está efetuando leitura hermenêutica do material...</p>
              <p className="text-xs text-slate-500">Mapeando passagens da lei seca para estruturar gabarito.</p>
            </div>
          )}

          {!loadingAnalysis && analysisResult && (
            <div className="space-y-6" id="analysis-ready-pane">
              
              {/* Summary and spaced points */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-900/80">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-400" /> Resumo do Especialista</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{analysisResult.summary}</p>
                </div>

                <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-900/80">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-yellow-500 font-bold flex items-center gap-1.5">📌 Tópicos de Fixação Espaçada</h4>
                  <ul className="space-y-2 select-text">
                    {analysisResult.keyPoints.map((kp, kpIdx) => (
                      <li key={kpIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Athena Autoral target CEBRASPE Question generated by AI based on material */}
              <div className="border border-yellow-600/30 rounded-xl bg-slate-950/40 p-5 space-y-4 relative overflow-hidden" id="athena-custom-ai-exam">
                <div className="absolute top-2 right-4 text-[9px] font-mono text-yellow-500/80 font-bold bg-yellow-500/10 border border-yellow-500/15 p-1 rounded uppercase">PROVA AUTORAL ATHENA</div>
                
                <div>
                  <span className="text-xs text-slate-500 font-mono block mb-1">Disciplina deduzida: {analysisResult.athenaQuestion.discipline || 'Legislação'}</span>
                  <h4 className="text-sm font-bold text-white leading-relaxed font-sans mt-2">
                    {analysisResult.athenaQuestion.statement}
                  </h4>
                </div>

                {/* choices review */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <button
                    onClick={() => { if (!answeredQuestion) setUserAnswer('C'); }}
                    disabled={answeredQuestion}
                    className={`py-3.5 font-bold rounded-xl text-center text-xs transition-all border ${
                      userAnswer === 'C' 
                        ? 'bg-green-950/40 border-green-500 text-green-400 font-extrabold' 
                        : 'bg-slate-950 border-slate-850 text-slate-500'
                    }`}
                  >
                    Certo
                  </button>
                  <button
                    onClick={() => { if (!answeredQuestion) setUserAnswer('E'); }}
                    disabled={answeredQuestion}
                    className={`py-3.5 font-bold rounded-xl text-center text-xs transition-all border ${
                      userAnswer === 'E' 
                        ? 'bg-red-950/10 border-red-500 text-red-300' 
                        : 'bg-slate-950 border-slate-850 text-slate-500'
                    }`}
                  >
                    Errado
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  {!answeredQuestion ? (
                    <button
                      onClick={handleCheckCustomAnswer}
                      disabled={!userAnswer}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                        userAnswer 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Confirmar Julgamento
                    </button>
                  ) : (
                    <div />
                  )}
                </div>

                {answeredQuestion && (
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl leading-relaxed space-y-2 animate-slide-up" id="auth-check-result">
                    <div className="flex justify-between items-center text-xs font-mono font-bold pb-1.5 border-b border-slate-900">
                      <span>Resultado: 
                        {userAnswer === analysisResult.athenaQuestion.correctAnswer ? (
                          <span className="text-emerald-400 font-extrabold ml-1.5">✓ ACERTOU! GABARITO GANHO</span>
                        ) : (
                          <span className="text-red-400 font-extrabold ml-1.5">✗ ERROU. PENALIZADO</span>
                        )}
                      </span>
                      <span>Gabarito oficial: <b className="text-yellow-500">{analysisResult.athenaQuestion.correctAnswer === 'C' ? 'Certo' : 'Errado'}</b></span>
                    </div>
                    <p className="text-xs text-slate-300 pt-1 leading-normal italic font-sans select-text">
                      <b>Athena explica:</b> {analysisResult.athenaQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE FORM TO MANUALLY ADD ANOTATIONS */}
      {activeTab === 'add' && (
        <div className="space-y-4 animate-fade-in max-w-xl mx-auto" id="add-material-form">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">Título do Material</label>
            <input
              id="library-title-input"
              type="text"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="Ex: Resumo de Poderes Administrativos - Poder de Polícia"
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider font-semibold text-slate-400 mb-2">Formato do Material</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Anotação">Anotação Digitada</option>
                <option value="PDF">PDF de Estudos</option>
                <option value="Apostila">Apostila Completa</option>
                <option value="Link YouTube">Link de Vídeo do YouTube</option>
              </select>
            </div>

            <div className="text-right flex items-end justify-end">
              <span className="text-[10px] text-slate-500 font-mono">Arraste documentos para ler por OCR se necessário</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">Conteúdo de Estudos / Artigos / Texto Principal</label>
            <textarea
              id="library-content-input"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Cole os artigos do CTB, resumos teóricos do seu caderno para que a Athena faça a leitura hermenêutica e gere a análise."
              rows={8}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-650"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-850 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateDocument}
              disabled={!materialTitle.trim() || !pastedText.trim()}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow ${
                materialTitle.trim() && pastedText.trim() 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                  : 'bg-slate-850 text-slate-600 cursor-not-allowed'
              }`}
              id="btn-save-library-item"
            >
              Salvar Documento <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
