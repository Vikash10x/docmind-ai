import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, User, Copy, Check, BookOpen, Volume2, VolumeX, Square } from 'lucide-react';
import SourceCard from './SourceCard';
import LoadingDots from './LoadingDots';
import { formatDate } from '../utils/formatters';

const ChatMessage = ({ message, isLoading = false }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message?.role === 'user';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-to-Speech handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = message.content
      .replace(/(\*\*|\*|__|_|#+|>|`{1,3})/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))) || voices.find(v => v.lang.startsWith('en'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  if (isLoading) {
    return (
      <div className="flex gap-3 animate-fade-in">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#fef3c7] border border-[#fde68a] shadow-xs"
        >
          <Sparkles size={15} className="text-amber-700" />
        </div>
        <div
          className="px-5 py-3.5 rounded-2xl rounded-tl-sm bg-white border border-[#e7e0d3] shadow-xs"
        >
          <LoadingDots />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* ── Avatar ── */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs"
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: 'white',
              }
            : {
                background: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#b45309',
              }
        }
      >
        {isUser
          ? <User size={15} className="text-white" />
          : <Sparkles size={15} className="text-amber-700" />
        }
      </div>

      {/* ── Bubble ── */}
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs"
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: 'white',
                  borderTopRightRadius: '4px',
                }
              : {
                  background: '#ffffff',
                  border: '1px solid #e7e0d3',
                  color: '#1c1917',
                  borderTopLeftRadius: '4px',
                }
          }
        >
          {isUser ? (
            <p className="font-medium">{message.content}</p>
          ) : (
            <div className="prose-custom">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* ── Sources cited ── */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
              <BookOpen size={12} />
              Sources Cited ({message.sources.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <SourceCard key={idx} source={source} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* ── Timestamp + Action Bar ── */}
        {!isUser && (
          <div className="flex items-center gap-2 px-1 mt-0.5">
            {message.timestamp && (
              <span className="text-[11px] text-stone-500 font-medium mr-1">
                {formatDate(message.timestamp)}
              </span>
            )}

            {/* Read Aloud Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-200 px-2 py-1 rounded-lg ${
                isSpeaking
                  ? 'text-amber-800 bg-amber-100 border border-amber-300'
                  : 'text-stone-600 hover:text-stone-900 bg-white border border-[#e7e0d3]'
              }`}
              title={isSpeaking ? 'Stop reading' : 'Read answer aloud'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={12} className="text-amber-700 animate-pulse" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={12} />
                  <span>Listen</span>
                </>
              )}
            </button>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-[11px] font-semibold transition-all duration-200 px-2 py-1 rounded-lg bg-white border border-[#e7e0d3] text-stone-600 hover:text-stone-900"
              title="Copy response"
            >
              {copied
                ? <><Check size={11} className="text-emerald-600" /> Copied</>
                : <><Copy size={11} /> Copy</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;


