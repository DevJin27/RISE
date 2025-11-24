"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ORB_SIZE = 180;      // ← one source of truth for all orbs
const FINAL_ORB = 360;

export default function CollidingOrbs() {
  const [collide, setCollide] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setCollide(true), 3200);
    const timer2 = setTimeout(() => setShowFinal(true), 4700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const orbBase =
    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-black via-gray-800 to-gray-900 flex items-center justify-center";

  const pulseText = {
    scale: [1, 1.06, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
  };

  const collisionEase = [0.16, 1, 0.3, 1]; // much smoother

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">

      {/* =================== CREATORS =================== */}
      <motion.div
        animate={{
          x: collide ? ["20vw", "50vw"] : ["20vw", "24vw", "18vw", "22vw"],
          y: collide ? ["30vh", "50vh"] : ["30vh", "26vh", "34vh", "28vh"],
          scale: collide ? [1, 0.7, 0] : [1, 1.03, 1],
          opacity: collide ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: collide ? 1.8 : 7,
          ease: collisionEase,
          repeat: collide ? 0 : Infinity,
        }}
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
        className={`${orbBase} shadow-[0_0_50px_rgba(0,0,0,0.6)]`}
      >
        <motion.span
          animate={pulseText.scale}
          transition={pulseText.transition}
          className="text-white text-xl font-bold tracking-[0.25em]"
        >
          CREATORS
        </motion.span>
      </motion.div>

      {/* =================== BRANDS =================== */}
      <motion.div
        animate={{
          x: collide ? ["75vw", "50vw"] : ["75vw", "70vw", "78vw", "73vw"],
          y: collide ? ["35vh", "50vh"] : ["35vh", "40vh", "30vh", "38vh"],
          scale: collide ? [1, 0.7, 0] : [1, 1.03, 1],
          opacity: collide ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: collide ? 1.8 : 7,
          ease: collisionEase,
          repeat: collide ? 0 : Infinity,
          delay: 0.5,
        }}
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
        className={`${orbBase} shadow-[0_0_50px_rgba(0,0,0,0.6)]`}
      >
        <motion.span
          animate={pulseText.scale}
          transition={{ ...pulseText.transition, delay: 0.3 }}
          className="text-white text-xl font-bold tracking-[0.25em]"
        >
          BRANDS
        </motion.span>
      </motion.div>

      {/* =================== TRUST =================== */}
      <motion.div
        animate={{
          x: collide ? ["45vw", "50vw"] : ["45vw", "50vw", "42vw", "48vw"],
          y: collide ? ["75vh", "50vh"] : ["75vh", "70vh", "80vh", "72vh"],
          scale: collide ? [1, 0.7, 0] : [1, 1.03, 1],
          opacity: collide ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: collide ? 1.8 : 7,
          ease: collisionEase,
          repeat: collide ? 0 : Infinity,
          delay: 1,
        }}
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
        className={`${orbBase} shadow-[0_0_50px_rgba(0,0,0,0.6)]`}
      >
        <motion.span
          animate={pulseText.scale}
          transition={{ ...pulseText.transition, delay: 0.6 }}
          className="text-white text-xl font-bold tracking-[0.25em]"
        >
          TRUST
        </motion.span>
      </motion.div>

      {/* =================== FINAL ORB =================== */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: showFinal ? [0.4, 1.15, 1] : 0,
          opacity: showFinal ? 1 : 0,
        }}
        transition={{
          duration: 1.6,
          ease: collisionEase,
        }}
        style={{ width: FINAL_ORB, height: FINAL_ORB }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full 
        bg-gradient-to-br from-black via-gray-700 to-black 
        shadow-[0_0_120px_rgba(0,0,0,0.6)] 
        flex flex-col items-center justify-center"
      >
        <div className="text-center">
          <div className="text-white text-4xl font-bold tracking-[0.3em] mb-1">
            THE 4TH
          </div>
          <div className="text-white text-5xl font-bold tracking-[0.3em]">
            WALL
          </div>
        </div>

        {/* subtle internal glow */}
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-white/5"
        />
      </motion.div>

      {/* =================== CLEAN PUNCH SHOCKWAVE =================== */}
      {collide && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0.6 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[400px] h-[400px] rounded-full border border-black/40"
        />
      )}

      {/* =================== FINAL TEXT =================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: showFinal ? 1 : 0,
          y: showFinal ? 0 : 40
        }}
        transition={{ duration: 1.2, delay: 1.8 }}
        className="absolute bottom-20 left-0 right-0 flex flex-col items-center"
      >
        <div className="w-56 h-[1px] bg-black/40 mb-4" />

        <p className="text-sm text-black/60 tracking-[0.35em] uppercase">
          Connecting Creators · Brands · Trust
        </p>
      </motion.div>
    </div>
  );
}
