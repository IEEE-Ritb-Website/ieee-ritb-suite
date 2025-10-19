import { useState, useEffect, useRef } from 'react';

/**
 * TerminalText Component
 * Creates typewriter-style terminal messages with scrolling feed
 * Features:
 * - Typewriter effect for each message
 * - Scrolling message feed
 * - Green/IEEE blue terminal aesthetic
 * - Auto-scrolls to show latest messages
 * - Customizable message list and timing
 */

interface TerminalMessage {
  text: string;
  delay?: number; // Delay before this message appears (ms)
  type?: 'system' | 'success' | 'info' | 'gpu'; // Message type for styling
}

interface TerminalTextProps {
  messages: TerminalMessage[];
  className?: string;
  typingSpeed?: number; // Characters per second
  isActive?: boolean;
  onComplete?: () => void;
}

const TerminalText = ({
  messages,
  className = '',
  typingSpeed = 40,
  isActive = true,
  onComplete,
}: TerminalTextProps) => {
  const [displayedMessages, setDisplayedMessages] = useState<{
    text: string;
    type: string;
    isComplete: boolean;
  }[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isActive || currentMessageIndex >= messages.length) {
      if (currentMessageIndex >= messages.length && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
      return;
    }

    const message = messages[currentMessageIndex];
    const chars = message.text.split('');
    let charIndex = 0;

    // Delay before starting this message
    const startDelay = message.delay || 0;

    const startTimer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < chars.length) {
          setCurrentText(prev => prev + chars[charIndex]);
          charIndex++;
        } else {
          clearInterval(typeInterval);

          // Message complete - add to displayed messages
          setDisplayedMessages(prev => [
            ...prev,
            {
              text: message.text,
              type: message.type || 'system',
              isComplete: true,
            },
          ]);

          setCurrentText('');
          setCurrentMessageIndex(prev => prev + 1);
        }
      }, 1000 / typingSpeed);

      return () => clearInterval(typeInterval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [currentMessageIndex, isActive, messages, typingSpeed, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedMessages, currentText]);

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'gpu':
        return 'text-[#00b4ff]';
      case 'info':
        return 'text-[#6b8cff]';
      default:
        return 'text-[#4d7fff]';
    }
  };

  const getMessagePrefix = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'gpu':
        return 'GPU:';
      case 'info':
        return 'STATUS:';
      default:
        return '>';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`font-mono text-sm max-h-32 overflow-y-auto custom-scrollbar ${className}`}
    >
      {displayedMessages.map((msg, index) => (
        <div
          key={index}
          className={`${getMessageColor(msg.type)} mb-1 opacity-0 animate-fade-in`}
          style={{
            animationDelay: '0ms',
            animationFillMode: 'forwards',
          }}
        >
          <span className="text-[#10b981] mr-2">{getMessagePrefix(msg.type)}</span>
          {msg.text}
        </div>
      ))}

      {currentText && (
        <div className="text-[#4d7fff]">
          <span className="text-[#10b981] mr-2">&gt;</span>
          {currentText}
          <span className="inline-block w-2 h-4 bg-[#4d7fff] ml-1 animate-blink" />
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(77, 127, 255, 0.1);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(77, 127, 255, 0.5);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(77, 127, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default TerminalText;
