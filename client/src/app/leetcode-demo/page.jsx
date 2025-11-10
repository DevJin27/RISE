'use client';

import React from 'react';
import LeetCodeActivityFeed from '@/components/LeetCodeActivityFeed';
import { Terminal, Code } from 'lucide-react';

export default function LeetCodeDemo() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b-2 border-cyan-400/30 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold tracking-wider">
                [ LEETCODE INTEGRATION DEMO ]
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Code className="w-4 h-4 animate-pulse" />
                <span className="text-sm text-cyan-400/70">Live data from LeetCode API</span>
              </div>
            </div>
          </div>
        </div>

        {/* LeetCode Activity Feed */}
        <LeetCodeActivityFeed username="Shrage" limit={15} showStats={true} />

        {/* API Info */}
        <div className="mt-12 border-t-2 border-cyan-400/30 pt-6">
          <h2 className="text-xl font-bold mb-4 tracking-wider">API ENDPOINTS</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">&gt;</span>
              <div>
                <code className="text-green-400">GET /api/leetcode/activity-feed?username=Shrage&limit=15</code>
                <p className="text-cyan-400/70 mt-1">Fetch enriched submission data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">&gt;</span>
              <div>
                <code className="text-green-400">GET /api/leetcode/profile?username=Shrage</code>
                <p className="text-cyan-400/70 mt-1">Get user profile statistics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400">&gt;</span>
              <div>
                <code className="text-green-400">GET /api/leetcode/problem-of-day</code>
                <p className="text-cyan-400/70 mt-1">Get today's daily challenge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
