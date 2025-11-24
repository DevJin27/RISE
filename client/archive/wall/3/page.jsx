"use client";
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ORB_SIZE = 160
const FINAL_ORB = 320
const ORB_Y = "50vh" // your constant horizontal level

export default function CollidingOrbs() {
  const [collide, setCollide] = useState(false)
  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setCollide(true), 2600)
    const timer2 = setTimeout(() => setShowFinal(true), 3800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const collisionEase = [0.22, 1, 0.36, 1]

  const orbStyle =
    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-black via-gray-800 to-gray-900 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.6)]"

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">

      {/* ================= CREATORS ================= */}
      <motion.div
        animate={{
          x: collide
            ? ["20vw", "50vw"]
            : ["20vw", "35vw", "20vw"],
          y: ORB_Y,
          scale: collide ? [1, 0.6, 0] : [1, 1.03, 1],
          opacity: collide ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: collide ? 1.4 : 3,
          repeat: collide ? 0 : Infinity,
          ease: collisionEase,
        }}
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
        className={orbStyle}
      >
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-lg font-bold tracking-[0.25em]"
        >
          CREATORS
        </motion.span>
      </motion.div>

      {/* ================= BRANDS ================= */}
      <motion.div
        animate={{
          x: collide
            ? ["80vw", "50vw"]
            : ["80vw", "65vw", "80vw"],
          y: ORB_Y,
          scale: collide ? [1, 0.6, 0] : [1, 1.03, 1],
          opacity: collide ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: collide ? 1.4 : 3,
          repeat: collide ? 0 : Infinity,
          ease: collisionEase,
        }}
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
        className={orbStyle}
      >
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="text-white text-lg font-bold tracking-[0.25em]"
        >
          BRANDS
        </motion.span>
      </motion.div>

      {/* ================= TRUST (STATIONARY) ================= */}
      <motion.div
        animate={{
          scale: collide ? [1, 1.15] : [1, 1.05, 1],
          y: ORB_Y,
          opacity: collide ? [1, 1] : [1, 0.95, 1],
        }}
        transition={{
          duration: collide ? 1.2 : 2,
          repeat: collide ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
        className={`${orbStyle} left-1/2`}
      >
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-lg font-bold tracking-[0.25em]"
        >
          TRUST
        </motion.span>
      </motion.div>

      {/* ================= FINAL MERGE ORB ================= */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: showFinal ? [0.6, 1.15, 1] : 0,
          opacity: showFinal ? 1 : 0,
        }}
        transition={{
          duration: 1,
          ease: collisionEase,
        }}
        style={{ width: FINAL_ORB, height: FINAL_ORB }}
        className="absolute left-1/2 top-[20vh] -translate-x-1/2 -translate-y-1/2 rounded-full 
        bg-gradient-to-br from-black via-gray-700 to-black
        shadow-[0_0_120px_rgba(0,0,0,0.6)] 
        flex flex-col items-center justify-center"
      >
        <div className="text-center">
          <div className="text-white text-3xl font-bold tracking-[0.3em] mb-1">
            THE 4TH
          </div>
          <div className="text-white text-4xl font-bold tracking-[0.3em]">
            WALL
          </div>
        </div>

        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-white/5"
        />
      </motion.div>

      {/* Shock pulse */}
      {collide && (
        <motion.div
          initial={{ scale: 0.4, opacity: 0.6 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute left-1/2 top-[20vh] -translate-x-1/2 -translate-y-1/2
          w-[340px] h-[340px] rounded-full border border-black/40"
        />
      )}

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: showFinal ? 1 : 0,
          y: showFinal ? 0 : 30
        }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-20 left-0 right-0 flex flex-col items-center"
      >
        <div className="w-52 h-[1px] bg-black/40 mb-4" />
        <p className="text-sm text-black/60 tracking-[0.35em] uppercase">
          Connecting Creators · Brands · Trust
        </p>
      </motion.div>
    </div>
  )
}