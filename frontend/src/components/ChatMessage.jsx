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

    // Stop any existing speech
    window.speechSynthesis.cancel();

    // Clean markdown symbols for natural pronunciation
    const cleanText = message.content
      .replace(/(\*\*|\*|__|_|#+|>|`{1,3})/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick English/Natural voice if available
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

  // Clean up speech on unmount
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
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(79,70,229,0.15) 100%)',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 0 12px rgba(139,92,246,0.15)',
          }}
        >
          <Sparkles size={14} className="text-violet-400" />
        </div>
        <div
          className="px-5 py-3.5 rounded-2xl rounded-tl-sm max-w-xs"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(8px)',
          }}
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
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                boxShadow: '0 0 12px rgba(124,58,237,0.35)',
              }
            : {
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(79,70,229,0.15) 100%)',
                border: '1px solid rgba(139,92,246,0.25)',
                boxShadow: '0 0 12px rgba(139,92,246,0.15)',
              }
        }
      >
        {isUser
          ? <User size={15} className="text-white" />
          : <Sparkles size={14} className="text-violet-400" />
        }
      </div>

      {/* ── Bubble ── */}
      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                  boxShadow: '0 4px 20px rgba(109,40,217,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  color: 'white',
                  borderTopRightRadius: '4px',
                }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  color: 'rgb(228,228,231)',
                  borderTopLeftRadius: '4px',
                }
          }
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose-custom">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* ── Timestamp + Copy + Audio Read Aloud (AI messages) ── */}
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            {message.timestamp && (
              <span className="text-[11px] text-zinc-600 mr-1">
                {formatDate(message.timestamp)}
              </span>
            )}

            {/* Read Aloud Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 text-[11px] font-medium transition-all duration-200 px-2 py-1 rounded-lg ${
                isSpeaking
                  ? 'text-violet-300 bg-violet-500/20 border border-violet-500/30'
                  : 'text-zinc-500 hover:text-zinc-300 bg-white/[0.03]'
              }`}
              title={isSpeaking ? 'Stop reading' : 'Read answer aloud'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={12} className="text-violet-400 animate-pulse" />
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
              className="flex items-center gap-1 text-[11px] font-medium transition-all duration-200 px-2 py-1 rounded-lg"
              style={{
                color: copied ? '#34d399' : 'rgb(113,113,122)',
                background: 'rgba(255,255,255,0.03)',
              }}
              title="Copy response"
            >
              {copied
                ? <><Check size={11} className="text-emerald-400" /> Copied</>
                : <><Copy size={11} /> Copy</>
              }
            </button>
          </div>
        )}

        {/* ── Sources ── */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen size={11} className="text-zinc-600" />
              <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Sources</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <SourceCard key={idx} source={source} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
