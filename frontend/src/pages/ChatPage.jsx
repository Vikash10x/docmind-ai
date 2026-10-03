import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Trash2, FileText, RotateCcw, AlertCircle, Loader2, MessageSquare, Sparkles,
  Download, FileDown, Printer, ChevronDown, Check, Mic, MicOff, Radio
} from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import { chatAPI, documentsAPI } from '../services/api';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [docError, setDocError] = useState('');
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast('🎙️ Listening... Speak your question.', { icon: '✨' });
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setQuestion(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access was denied. Please enable mic permissions.');
        } else if (event.error !== 'no-speech') {
          toast.error(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      toast.error('Could not start microphone.');
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  useEffect(() => {
    const init = async () => {
      try {
        const [docRes, historyRes] = await Promise.all([
          documentsAPI.getById(documentId),
          chatAPI.getHistory(documentId),
        ]);
        setDocument(docRes.data.document);
        setMessages(historyRes.data.messages || []);
      } catch (err) {
        setDocError(err.response?.data?.error || 'Failed to load document.');
      } finally {
        setHistoryLoading(false);
      }
    };
    init();
  }, [documentId]);

  const sendMessage = useCallback(async () => {
    const q = question.trim();
    if (!q || loading) return;
    const userMsg = { role: 'user', content: q, sources: [], timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion(''); setLoading(true); setError('');
    try {
      const { data } = await chatAPI.ask(documentId, q);
      setMessages((prev) => [...prev, {
        role: 'assistant', content: data.answer, sources: data.sources || [], timestamp: new Date(),
      }]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to get answer. Please try again.';
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
      setQuestion(q);
      toast.error(msg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [question, loading, documentId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportChatMarkdown = () => {
    if (!messages.length) return;
    let text = `# Chat Transcript: ${document?.originalName || 'Document'}\n`;
    text += `*Exported from DocMind AI on ${new Date().toLocaleString()}*\n\n---\n\n`;
    messages.forEach((m) => {
      const roleName = m.role === 'user' ? '👤 **You**' : '🤖 **DocMind AI**';
      text += `### ${roleName}\n\n${m.content}\n\n`;
      if (m.sources && m.sources.length > 0) {
        text += `> **Sources cited:**\n`;
        m.sources.forEach((s) => {
          text += `> - Page ${s.page}: "${(s.text || '').slice(0, 140)}..."\n`;
        });
        text += `\n`;
      }
      text += `---\n\n`;
    });
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${(document?.originalName || 'document').replace(/\.[^/.]+$/, '')}_chat.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
    toast.success('Chat exported as Markdown (.md)');
  };

  const exportChatTxt = () => {
    if (!messages.length) return;
    let text = `====================================================\n`;
    text += `CHAT TRANSCRIPT: ${document?.originalName || 'Document'}\n`;
    text += `Date: ${new Date().toLocaleString()}\n`;
    text += `====================================================\n\n`;
    messages.forEach((m) => {
      const roleName = m.role === 'user' ? 'YOU' : 'DOCMIND AI';
      text += `[${roleName}] (${new Date(m.timestamp || Date.now()).toLocaleTimeString()}):\n`;
      text += `${m.content}\n`;
      if (m.sources && m.sources.length > 0) {
        text += `Sources: ${m.sources.map((s) => `Page ${s.page}`).join(', ')}\n`;
      }
      text += `\n----------------------------------------------------\n\n`;
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${(document?.originalName || 'document').replace(/\.[^/.]+$/, '')}_chat.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
    toast.success('Chat exported as Text (.txt)');
  };

  const handlePrint = () => {
    setShowExportMenu(false);
    window.print();
  };

  const handleClearChat = async () => {
    if (!window.confirm('Clear all chat history for this document?')) return;
    try {
      await chatAPI.clearHistory(documentId);
      setMessages([]);
      toast.success('Chat history cleared.');
    } catch { toast.error('Failed to clear chat history.'); }
  };

  const handleRegenerate = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;
    setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1));
    setQuestion(lastUserMsg.content);
    setTimeout(() => sendMessage(), 50);
  }, [messages, sendMessage]);

  if (docError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#fbf9f4]"
      >
        <div className="text-center p-8 bg-white border border-[#e7e0d3] rounded-2xl shadow-sm max-w-sm w-full mx-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-red-50 border border-red-200"
          >
            <AlertCircle size={26} className="text-red-600" />
          </div>
          <h2 className="text-[#1c1917] font-bold text-lg mb-1">Document not found</h2>
          <p className="text-stone-600 text-xs mb-6">{docError}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full py-2.5">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const suggestedQuestions = [
    'What is this document about?',
    'Summarize the key points',
    'What are the main findings?',
    'List the most important topics',
  ];

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-[#fbf9f4] text-[#1c1917]"
    >
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(217,119,6,0.06) 0%, transparent 60%)',
        }}
      />

      {/* ── Header ── */}
      <header
        className="flex-shrink-0 relative z-10 bg-[#f4f0e6]/95 border-b border-[#e7e0d3] backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-4 h-[60px] flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:text-stone-900 bg-white border border-[#e7e0d3] hover:bg-[#f4f0e6] transition-all shadow-xs"
          >
            <ArrowLeft size={16} />
          </button>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-50 border border-amber-200 text-amber-700"
          >
            <FileText size={16} />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-[#1c1917] truncate leading-snug">
              {document?.originalName || 'Loading...'}
            </h1>
            {document && (
              <p className="text-[11px] text-stone-500 font-medium">
                {document.totalPages} pages · {document.totalChunks} vectors indexed
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 relative">
            {messages.length > 0 && (
              <>
                {/* Export Chat dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-[#1c1917] bg-white border border-[#e7e0d3] hover:bg-[#f4f0e6] transition-all shadow-xs"
                    title="Export Conversation"
                  >
                    <Download size={13} className="text-amber-700" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown size={12} className="opacity-60" />
                  </button>

                  {showExportMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowExportMenu(false)}
                      />
                      <div
                        className="absolute right-0 mt-2 w-48 rounded-xl py-1.5 z-50 shadow-lg bg-white border border-[#e7e0d3] animate-fade-in"
                      >
                        <div className="px-3 py-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                          Export Chat As
                        </div>
                        <button
                          onClick={exportChatMarkdown}
                          className="w-full px-3 py-2 text-left text-xs text-[#1c1917] hover:bg-[#f4f0e6] flex items-center gap-2.5 transition-colors font-medium"
                        >
                          <FileDown size={14} className="text-amber-700" />
                          <span>Markdown (.md)</span>
                        </button>
                        <button
                          onClick={exportChatTxt}
                          className="w-full px-3 py-2 text-left text-xs text-[#1c1917] hover:bg-[#f4f0e6] flex items-center gap-2.5 transition-colors font-medium"
                        >
                          <FileText size={14} className="text-amber-800" />
                          <span>Plain Text (.txt)</span>
                        </button>
                        <div className="my-1 border-t border-[#e7e0d3]" />
                        <button
                          onClick={handlePrint}
                          className="w-full px-3 py-2 text-left text-xs text-[#1c1917] hover:bg-[#f4f0e6] flex items-center gap-2.5 transition-colors font-medium"
                        >
                          <Printer size={14} className="text-emerald-700" />
                          <span>Print / Save PDF</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleRegenerate}
                  disabled={loading || messages.length < 2}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 bg-white border border-[#e7e0d3] hover:bg-[#f4f0e6] transition-all shadow-xs"
                  title="Regenerate last answer"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:text-red-700 disabled:opacity-30 bg-white border border-[#e7e0d3] hover:bg-red-50 transition-all shadow-xs"
                  title="Clear chat history"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {historyLoading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={24} className="animate-spin text-amber-700" />
                <p className="text-xs text-stone-600 font-medium">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-[#fef3c7] border border-[#fde68a] shadow-sm animate-float"
              >
                <MessageSquare size={34} className="text-amber-800" />
              </div>
              <h3 className="text-[#1c1917] font-bold text-lg mb-1">Ready to answer</h3>
              <p className="text-stone-600 text-sm max-w-sm leading-relaxed mb-8">
                Ask anything about{' '}
                <span className="text-[#1c1917] font-semibold">{document?.originalName}</span>.
                Answers are grounded in document content.
              </p>

              {/* Suggested questions */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-amber-900 bg-white border border-[#e7e0d3] hover:border-amber-500/40 hover:bg-[#fef3c7]/50 transition-all duration-200 shadow-xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)
          )}

          {loading && <ChatMessage isLoading />}

          {error && (
            <div
              className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm animate-fade-in bg-red-50 border border-red-200 text-red-700"
            >
              <AlertCircle size={14} className="flex-shrink-0 text-red-600" />
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div
        className="flex-shrink-0 relative z-10 bg-[#f4f0e6]/95 border-t border-[#e7e0d3] backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div
            className="flex gap-3 items-end rounded-2xl p-3 transition-all duration-200 bg-white border border-[#e7e0d3] shadow-sm focus-within:border-amber-600/60 focus-within:ring-2 focus-within:ring-amber-500/15"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                id="chat-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about this document..."
                rows={1}
                disabled={loading || document?.status !== 'completed'}
                className="w-full bg-transparent text-[#1c1917] placeholder-stone-400 text-sm resize-none focus:outline-none leading-relaxed max-h-32 overflow-y-auto font-medium"
                style={{ minHeight: '24px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
            </div>
            {/* Voice Input Mic button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={loading || document?.status !== 'completed'}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30"
              style={
                isListening
                  ? {
                      background: 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
                      boxShadow: '0 0 16px rgba(217,119,6,0.4)',
                      color: 'white',
                    }
                  : {
                      background: '#f4f0e6',
                      border: '1px solid #e7e0d3',
                      color: '#57534e',
                    }
              }
              title={isListening ? 'Stop listening' : 'Voice Input (Speak your question)'}
            >
              {isListening ? (
                <MicOff size={16} className="text-white animate-pulse" />
              ) : (
                <Mic size={16} className="hover:text-amber-800" />
              )}
            </button>

            {/* Send button */}
            <button
              id="chat-send-btn"
              onClick={sendMessage}
              disabled={!question.trim() || loading || document?.status !== 'completed'}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30"
              style={{
                background: question.trim() && !loading
                  ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                  : '#ede8dd',
                color: question.trim() && !loading ? 'white' : '#a8a29e',
                boxShadow: question.trim() && !loading ? '0 4px 14px rgba(217,119,6,0.3)' : 'none',
              }}
              title="Send question"
            >
              {loading
                ? <Loader2 size={16} className="animate-spin text-white" />
                : <Send size={16} className={question.trim() ? 'text-white' : 'text-stone-400'} />
              }
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            <Sparkles size={11} className="text-amber-700" />
            <p className="text-[11px] text-stone-500 font-medium text-center">
              Answers grounded in document · Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ChatPage;
