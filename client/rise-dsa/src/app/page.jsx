"use client"
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter} from 'next/navigation'

export default function LandingPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/60 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold group">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">RISE</span>
            <motion.svg 
              className="w-5 h-5 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-gray-400 hover:text-white transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#contact" className="text-gray-400 hover:text-white transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white transition-colors"
            onClick={() => router.push("/login")}
            >
              Login
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating Code Snippets */}
          <motion.div
            className="absolute top-20 left-10 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-green-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              opacity: { delay: 1, duration: 0.6 },
              y: { delay: 1.6, duration: 4, repeat: Infinity, ease: "easeInOut" },
              x: { delay: 1.6, duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div>function quickSort(arr) {'{'}</div>
            <div className="ml-4">if (arr.length &lt;= 1) return arr;</div>
          </motion.div>
          
          <motion.div
            className="absolute top-40 right-10 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: [0, 20, 0],
              x: [0, -15, 0]
            }}
            transition={{ 
              opacity: { delay: 1.2, duration: 0.6 },
              y: { delay: 1.8, duration: 5, repeat: Infinity, ease: "easeInOut" },
              x: { delay: 1.8, duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div>class TreeNode:</div>
            <div className="ml-4">def __init__(self, val):</div>
            <div className="ml-8">self.val = val</div>
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-20 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-purple-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: [0, 15, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              opacity: { delay: 1.4, duration: 0.6 },
              x: { delay: 2, duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              y: { delay: 2, duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div>O(n log n)</div>
            <div className="text-gray-500">// Time Complexity</div>
          </motion.div>

          <motion.div
            className="absolute top-60 left-32 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-yellow-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, 12, 0],
              x: [0, -8, 0]
            }}
            transition={{ 
              opacity: { delay: 1.6, duration: 0.6 },
              scale: { delay: 1.6, duration: 0.6 },
              y: { delay: 2.2, duration: 5, repeat: Infinity, ease: "easeInOut" },
              x: { delay: 2.2, duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div>const binarySearch = (arr, target) =&gt; {'{'}</div>
            <div className="ml-4">let left = 0, right = arr.length - 1;</div>
          </motion.div>

          <motion.div
            className="absolute bottom-32 right-24 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-pink-400"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: [0, -12, 0],
              y: [0, 15, 0]
            }}
            transition={{ 
              opacity: { delay: 1.8, duration: 0.6 },
              x: { delay: 2.4, duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              y: { delay: 2.4, duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div>struct Node {'{'}</div>
            <div className="ml-4">int data;</div>
            <div className="ml-4">Node* next;</div>
            <div>{'};'}</div>
          </motion.div>

          <motion.div
            className="absolute top-96 right-32 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-cyan-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -18, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              opacity: { delay: 2, duration: 0.6 },
              y: { delay: 2.6, duration: 6, repeat: Infinity, ease: "easeInOut" },
              x: { delay: 2.6, duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div>def dfs(node):</div>
            <div className="ml-4">if not node: return</div>
            <div className="ml-4">visited.add(node)</div>
          </motion.div>

          <motion.div
            className="absolute top-72 left-48 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 text-xs font-mono text-orange-400"
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              rotate: [0, 3, 0, -3, 0],
              y: [0, 10, 0],
              x: [0, -12, 0]
            }}
            transition={{ 
              opacity: { delay: 2.2, duration: 0.6 },
              rotate: { delay: 2.8, duration: 8, repeat: Infinity, ease: "easeInOut" },
              y: { delay: 2.8, duration: 5, repeat: Infinity, ease: "easeInOut" },
              x: { delay: 2.8, duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div>Space: O(1)</div>
            <div className="text-gray-500">// Constant</div>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your AI Mentor for{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              DSA
            </span>
          </motion.h1>

          <motion.div 
            className="flex items-center justify-center gap-3 text-gray-400 mb-10 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="px-3 py-1 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full">Recursion</span>
            <span className="text-orange-500">•</span>
            <span className="px-3 py-1 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full">Iteration</span>
            <span className="text-orange-500">•</span>
            <span className="px-3 py-1 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full">Structures</span>
            <span className="text-orange-500">•</span>
            <span className="px-3 py-1 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full">Efficiency</span>
          </motion.div>

          <motion.p 
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Master Data Structures and Algorithms with personalized guidance from your AI mentor. 
            Get instant feedback, tailored learning paths, and real-time support to ace your coding interviews.
          </motion.p>

          <motion.div 
            className="flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/signup")}
            >
              Sign Up for Free
            </motion.button>
            <motion.button 
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/login")}
            >
              Login
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-gray-500 text-sm">DSA Problems</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-500 text-sm">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-gray-500 text-sm">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/80 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
          <div>
            © 2024 RISE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}