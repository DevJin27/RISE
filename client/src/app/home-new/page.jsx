"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Terminal, AlertCircle, TrendingUp, Zap, ChevronRight, Activity } from 'lucide-react';

// Constants
const BOOT_SEQUENCE = [
  '> Initializing neural network...',
  '> Loading problem database...',
  '> Analyzing performance metrics...',
  '> System ready.'
];

const TYPING_SPEED = 50;
const CURSOR_BLINK_SPEED = 500;
const GLITCH_INTERVAL = 5000;
const SESSION_UPDATE_INTERVAL = 60000;
const BOOT_DELAY = 400;

const PERFORMANCE_METRICS = [
  { label: 'Accuracy', value: '87%', color: 'text-green-400' },
  { label: 'Avg. Time', value: '18 min', color: 'text-cyan-400' },
  { label: 'Streak', value: '12 days', color: 'text-yellow-400' }
];

const MENTOR_MESSAGES = [
  {
    type: 'OPTIMIZATION TIP',
    icon: Zap,
    color: 'cyan',
    message: "Your logic is correct, but consider more efficient solutions with fewer recursive calls."
  },
  {
    type: 'PATTERN DETECTED',
    icon: Activity,
    color: 'green',
    message: "Great! You're using dynamic programming. This approach reduces complexity significantly."
  },
  {
    type: 'WARNING',
    icon: AlertCircle,
    color: 'yellow',
    message: "Edge case detected: Your solution may fail for negative values. Test with [-1, -2, 3]."
  }
];

const SUGGESTED_PROBLEMS = [
  "Dijkstra's Algorithm (Hard)",
  "Graph Coloring (Medium)"
];

export default function DSAMentorTerminal() {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [terminalLines, setTerminalLines] = useState([]);
  const [progressAnimation, setProgressAnimation] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(41);
  const [problemsSolved, setProblemsSolved] = useState(2);
  const [sessionTime, setSessionTime] = useState(45);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fullText = "Weak topic detected: Graphs";

  useEffect(() => {
    // Typing animation
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, TYPING_SPEED);

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, CURSOR_BLINK_SPEED);

    // Progress animation
    const progressTimeout = setTimeout(() => setProgressAnimation(60), 300);

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, GLITCH_INTERVAL);

    // Terminal boot sequence
    const bootTimeouts = BOOT_SEQUENCE.map((line, index) => 
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, index * BOOT_DELAY)
    );

    // Session time counter
    const timeInterval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, SESSION_UPDATE_INTERVAL);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      clearInterval(glitchInterval);
      clearInterval(timeInterval);
      clearTimeout(progressTimeout);
      bootTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleBeginSession = useCallback(() => {
    setTerminalLines(prev => [...prev, '> Starting new problem session...']);
    setTimeout(() => {
      setTerminalLines(prev => [...prev, '> Problem loaded: Subset Sum']);
      setTerminalLines(prev => [...prev, '> Timer started. Good luck.']);
    }, 500);
  }, []);

  const formatTime = useCallback((mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
  }, []);

  const progressPercentage = useMemo(() => 
    Math.round((problemsSolved / 5) * 100), 
    [problemsSolved]
  );

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-8 relative overflow-hidden">
      {/* Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse" 
             style={{animation: 'scanline 8s linear infinite', height: '100%'}}></div>
      </div>

      {/* CRT flicker overlay */}
      <div className={`pointer-events-none fixed inset-0 bg-cyan-400/5 ${glitchEffect ? 'animate-pulse' : ''}`}></div>

      {/* Terminal grid background */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px'
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b-2 border-cyan-400/30 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold tracking-wider">
                [ SYSTEM ONLINE ]
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-sm text-cyan-400/70">Neural link established</span>
              </div>
            </div>
          </div>

          {/* Terminal boot lines */}
          <div 
            className="bg-black/50 border border-cyan-400/30 rounded p-3 mb-4 text-xs"
            role="log"
            aria-label="Terminal output"
            aria-live="polite"
          >
            {terminalLines.map((line, idx) => (
              <div key={`terminal-line-${idx}`} className="mb-1 text-cyan-400/70">
                {line}
              </div>
            ))}
          </div>

          {/* System diagnostics */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">&gt;</span>
              <div className="flex-1">
                <span className="text-cyan-400">{typedText}</span>
                {showCursor && <span className="bg-cyan-400 w-2 inline-block ml-1">_</span>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">&gt;</span>
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">Confidence level:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-cyan-400/20 border border-cyan-400/40 relative overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-cyan-400"
                      style={{
                        width: `${confidenceLevel}%`,
                        transition: 'width 2s ease-out',
                        boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)'
                      }}
                    ></div>
                  </div>
                  <span className={`font-bold ${confidenceLevel < 50 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                    {confidenceLevel}%
                  </span>
                  {confidenceLevel < 50 && (
                    <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Objective */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3 tracking-wide">
            Mission Objective:
          </h2>
          <p className="text-2xl text-cyan-400/90 mb-8 tracking-wide">
            Reinforce Graphs — solve 2 problems today
          </p>

          <button 
            onClick={handleBeginSession}
            className="relative group"
            onMouseEnter={() => setHoveredCard('button')}
            onMouseLeave={() => setHoveredCard(null)}
            aria-label="Begin new problem session"
          >
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/40 transition-all duration-300" aria-hidden="true"></div>
            <div className="relative border-2 border-cyan-400 px-8 py-4 bg-black/80 hover:bg-cyan-400/10 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              <span className="text-lg tracking-widest font-bold">BEGIN SESSION</span>
            </div>
          </button>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mission Progress */}
          <div 
            className="relative group"
            onMouseEnter={() => setHoveredCard('progress')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 blur opacity-0 group-hover:opacity-100 transition duration-300`}></div>
            <div className="relative bg-black border border-cyan-400/40 p-6">
              <div className="border-b-2 border-cyan-400/30 pb-3 mb-6">
                <h3 className="text-xl tracking-wider">MISSION PROGRESS</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3 text-sm">
                    <span className="text-cyan-400/70">Problems Solved:</span>
                    <span className="text-cyan-400 font-bold text-lg">{problemsSolved}/5</span>
                  </div>
                  <div 
                    className="relative h-8 bg-cyan-400/10 border border-cyan-400/40"
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Problems solved progress"
                  >
                    <div 
                      className="absolute inset-0 bg-cyan-400/30"
                      style={{
                        width: `${progressPercentage}%`,
                        transition: 'width 1s ease-out'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {progressPercentage}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-cyan-400/70">Session Time:</span>
                    <span className="text-cyan-400 font-bold">{formatTime(sessionTime)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyan-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4" aria-hidden="true" />
                    <span className="text-xs text-cyan-400/70">PERFORMANCE METRICS</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {PERFORMANCE_METRICS.map((metric, idx) => (
                      <div key={`metric-${idx}`} className="flex justify-between">
                        <span className="text-cyan-400/60">{metric.label}:</span>
                        <span className={metric.color}>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className="w-full border border-cyan-400/50 py-2 text-sm hover:bg-cyan-400/10 transition-all duration-200 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  aria-label="View full statistics"
                >
                  VIEW FULL STATS &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Active Challenge */}
          <div 
            className="relative group"
            onMouseEnter={() => setHoveredCard('challenge')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute -inset-1 bg-cyan-400/30 blur-md opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-black border-2 border-cyan-400 p-8">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 border border-cyan-400/50 text-xs mb-4 tracking-wider">
                  ACTIVE CHALLENGE
                </div>
                <h3 className="text-3xl font-bold mb-2">Solve</h3>
                <h3 className="text-3xl font-bold mb-4">Subset Sum</h3>
                <div className="inline-block px-4 py-1 bg-cyan-400/20 border border-cyan-400/50 text-sm">
                  (Medium)
                </div>
              </div>

              <div className="relative h-3 bg-cyan-400/20 border border-cyan-400/40 mb-6 overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-cyan-400"
                  style={{
                    width: `${progressAnimation}%`,
                    transition: 'width 2s ease-out',
                    boxShadow: '0 0 15px rgba(6, 182, 212, 0.8)'
                  }}
                ></div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-cyan-400/20 pb-2">
                  <span className="text-cyan-400/70">Time Remaining:</span>
                  <span className="text-cyan-400 font-bold">2h 15m</span>
                </div>
                <div className="flex justify-between text-sm border-b border-cyan-400/20 pb-2">
                  <span className="text-cyan-400/70">Attempts:</span>
                  <span className="text-cyan-400 font-bold">3/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400/70">XP Reward:</span>
                  <span className="text-yellow-400 font-bold">+150 XP</span>
                </div>
              </div>

              <button 
                className="w-full mt-8 border-2 border-cyan-400 py-4 text-lg font-bold hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]"
                aria-label="Continue working on Subset Sum problem"
              >
                CONTINUE PROBLEM
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mentor Feed */}
          <div 
            className="relative group"
            onMouseEnter={() => setHoveredCard('mentor')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-black border border-cyan-400/40 p-6 h-full">
              <div className="border-b-2 border-cyan-400/30 pb-3 mb-6">
                <h3 className="text-xl tracking-wider">MENTOR FEED</h3>
              </div>

              <div className="space-y-6" role="feed" aria-label="AI Mentor feedback">
                {MENTOR_MESSAGES.map((msg, idx) => {
                  const Icon = msg.icon;
                  return (
                    <div 
                      key={`mentor-msg-${idx}`}
                      className={`border-l-2 border-${msg.color}-400 pl-4 py-2 bg-${msg.color}-400/5`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${msg.color !== 'cyan' ? `text-${msg.color}-400` : ''}`} aria-hidden="true" />
                        <span className={`text-xs text-${msg.color}-400/70 tracking-wider`}>{msg.type}</span>
                      </div>
                      <p className={`text-sm text-${msg.color}-400/90 leading-relaxed`}>
                        {msg.message}
                      </p>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-cyan-400/20">
                  <div className="text-xs text-cyan-400/60 mb-3">SUGGESTED NEXT:</div>
                  <div className="space-y-2">
                    {SUGGESTED_PROBLEMS.map((problem, idx) => (
                      <button
                        key={`suggested-${idx}`}
                        className="w-full text-left border border-cyan-400/30 p-2 text-xs hover:bg-cyan-400/10 cursor-pointer transition-all"
                        aria-label={`Start ${problem} problem`}
                      >
                        → {problem}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer terminal prompt */}
        <div className="mt-12 border-t-2 border-cyan-400/30 pt-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-cyan-400">&gt;</span>
            <span className="text-cyan-400/70">Ready for next command</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}