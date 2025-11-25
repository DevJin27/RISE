"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import problemSets from "./problemSets";

const steps = Object.keys(problemSets);

export default function Stairs() {
  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(0);

  const allSteps = steps.map((step, i) => ({
    name: step,
    index: i,
    visible: i >= index - 1 && i <= index + 1,
    isFocus: i === index,
  }));

  const handleScroll = (e) => {
    if (isAnimating) return;

    if (e.deltaY < -20 && index < steps.length - 1) {
      setIndex(prev => prev + 1);
    }

    if (e.deltaY > 20 && index > 0) {
      setIndex(prev => prev - 1);
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const getCardPosition = (i) => {
    const relativeIndex = i - index;
    
    if (relativeIndex === -1) {
      return { x: -280, y: 420, scale: 0.9, opacity: 0.4, blur: 2, rotate: -3 };
    } else if (relativeIndex === 0) {
      return { x: 120, y: 220, scale: 1.15, opacity: 1, blur: 0, rotate: 0 };
    } else if (relativeIndex === 1) {
      return { x: 520, y: 20, scale: 0.9, opacity: 0.4, blur: 2, rotate: 3 };
    }
    
    return { x: 1200, y: -200, scale: 0.5, opacity: 0, blur: 10, rotate: 0 };
  };

  const totalProblems = Object.values(problemSets).reduce((a, b) => a + b, 0);

  return (
    <div
      onWheel={handleScroll}
      className="w-full h-screen bg-[#0b1120] overflow-hidden relative"
    >
      {/* Subtle ambient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Title - matching home page style */}
      <div className="absolute top-12 left-12 z-10">
        <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">Your Journey</p>
        <h1 className="text-4xl font-semibold text-white/90">
          Learning Path
        </h1>
        <p className="text-gray-400 mt-1">Master DSA step by step</p>
      </div>

      {/* Progress stats - matching home page glass style */}
      <div className="absolute top-12 right-12 z-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <div className="text-sm text-gray-400 mb-2">Overall Progress</div>
        <div className="text-3xl font-semibold text-white/90 mb-3">0%</div>
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-blue-400 font-semibold">{totalProblems}</div>
            <div className="text-gray-400">Total</div>
          </div>
          <div>
            <div className="text-blue-400 font-semibold">{completed}</div>
            <div className="text-gray-400">Solved</div>
          </div>
        </div>
      </div>

      {/* All steps */}
      {allSteps.map((step) => {
        const pos = getCardPosition(step.index);
        return (
          <motion.div
            key={step.name}
            animate={{
              x: pos.x,
              y: pos.y,
              scale: pos.scale,
              opacity: pos.opacity,
              filter: `blur(${pos.blur}px)`,
              rotate: pos.rotate,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-64 
                       rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10
                       flex flex-col items-center justify-center 
                       text-white shadow-2xl
                       hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            style={{
              boxShadow: step.isFocus 
                ? '0 20px 60px -15px rgba(59, 130, 246, 0.3)' 
                : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
              transformOrigin: 'center center',
            }}
          >
            {/* Step number badge */}
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
              {step.index + 1}
            </div>

            {/* Difficulty badge */}
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium text-gray-400">
              {step.index < 3 ? 'Easy' : step.index < 6 ? 'Medium' : 'Hard'}
            </div>

            <h1 className={`text-3xl font-semibold tracking-tight mb-4 ${step.isFocus ? 'text-white/90' : 'text-white/50'}`}>
              {step.name}
            </h1>

            <div className={`text-sm ${step.isFocus ? 'text-gray-400' : 'text-white/30'} flex items-center gap-4 mb-6`}>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {problemSets[step.name]} Problems
              </span>
              <span className="text-white/20">·</span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {completed} Completed
              </span>
            </div>

            {/* Action button */}
            {step.isFocus && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-2.5 rounded-md bg-blue-500 text-black font-semibold hover:opacity-90 transition"
              >
                Start Learning
              </motion.button>
            )}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: '0%' }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-500 text-sm">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg"
        >
          ↕
        </motion.div>
        <span className="font-medium">Scroll to navigate</span>
        <div className="flex gap-2 mt-1">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index 
                  ? 'bg-blue-400 w-8' 
                  : Math.abs(i - index) === 1
                    ? 'bg-blue-400/60'
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-12 left-12 text-gray-500 text-sm">
        Step {index + 1} of {steps.length}
      </div>
    </div>
  );
}