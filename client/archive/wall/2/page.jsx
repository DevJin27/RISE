"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BALL = 80;
const FINAL_ORB = 320;

export default function AppleStyleSequence() {
  const [kick, setKick] = useState(false);
  const [collision, setCollision] = useState(false);
  const [trustDrop, setTrustDrop] = useState(false);
  const [merge, setMerge] = useState(false);

  useEffect(() => {
    setTimeout(() => setKick(true), 1500);
    setTimeout(() => setCollision(true), 3600);
    setTimeout(() => setTrustDrop(true), 3900);
    setTimeout(() => setMerge(true), 5500);
  }, []);

  const smoothEase = [0.22, 1, 0.36, 1];

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">

      {/* ================= PEOPLE ================= */}
      <div className="absolute left-16 bottom-24 text-center">
        <div className="mb-3 tracking-[0.3em] text-sm text-black/80 font-medium">
          CREATOR
        </div>
        <div className="w-16 h-28 bg-black rounded-full mx-auto" />
      </div>

      <div className="absolute right-16 bottom-24 text-center">
        <div className="mb-3 tracking-[0.3em] text-sm text-black/80 font-medium">
          BRAND
        </div>
        <div className="w-16 h-28 bg-black rounded-full mx-auto" />
      </div>

      {/* ================= CREATOR BALL ================= */}
      <motion.div
        animate={{
          x: kick ? "48vw" : "8vw",
          y: "70vh",
          scale: merge ? 0 : 1,
          opacity: merge ? 0 : 1,
        }}
        transition={{
          duration: 2.4,
          ease: smoothEase,
        }}
        style={{ width: BALL, height: BALL }}
        className="absolute rounded-full bg-black shadow-[0_0_40px_rgba(0,0,0,0.4)] 
        flex items-center justify-center text-white font-semibold tracking-wide"
      >
        CREATOR
      </motion.div>

      {/* ================= BRAND BALL ================= */}
      <motion.div
        animate={{
          x: kick ? "48vw" : "90vw",
          y: "70vh",
          scale: merge ? 0 : 1,
          opacity: merge ? 0 : 1,
        }}
        transition={{
          duration: 2.4,
          ease: smoothEase,
        }}
        style={{ width: BALL, height: BALL }}
        className="absolute rounded-full bg-black shadow-[0_0_40px_rgba(0,0,0,0.4)] 
        flex items-center justify-center text-white font-semibold tracking-wide"
      >
        BRAND
      </motion.div>

      {/* ================= IMPACT SHOCK RING ================= */}
      {collision && (
        <motion.div
          initial={{ scale: 0.2, opacity: 0.6 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2.8, ease: "easeOut" }}
          className="absolute left-1/2 top-[70vh] -translate-x-1/2 -translate-y-1/2 
          w-[250px] h-[250px] border border-black/20 rounded-full"
        />
      )}

      {/* ================= TRUST BALL ================= */}
      {trustDrop && (
        <motion.div
          initial={{ y: "-15vh", x: "48vw", scale: 0.8 }}
          animate={{
            y: merge ? "70vh" : "60vh",
            scale: merge ? 0 : 1,
            opacity: merge ? 0 : 1,
          }}
          transition={{
            duration: 2,
            ease: smoothEase,
          }}
          style={{ width: BALL, height: BALL }}
          className="absolute rounded-full border border-black bg-white 
          text-black font-semibold flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.2)]"
        >
          TRUST
        </motion.div>
      )}

      {/* ================= FINAL MERGE ORB ================= */}
      {merge && (
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
          transition={{
            duration: 2,
            ease: smoothEase,
          }}
          style={{ width: FINAL_ORB, height: FINAL_ORB }}
          className="absolute top-[60vh] left-1/2 -translate-x-1/2 -translate-y-1/2
          rounded-full bg-gradient-to-br from-black via-gray-900 to-black 
          shadow-[0_0_120px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center"
        >

          <div className="text-white text-3xl font-bold tracking-[0.4em]">
            THE 4TH
          </div>
          <div className="text-white text-4xl font-bold tracking-[0.4em] mt-1">
            WALL
          </div>

          {/* subtle breathing glow */}
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-white/5"
          />
        </motion.div>
      )}

      {/* ================= FINAL TEXT ================= */}
      {merge && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-24 w-full text-center text-black/70 text-sm tracking-[0.35em]"
        >
          CREATORS · BRANDS · TRUST
        </motion.div>
      )}
    </div>
  );
}