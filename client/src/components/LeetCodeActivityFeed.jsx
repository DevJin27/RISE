'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle, XCircle, Clock, TrendingUp, Code } from 'lucide-react';

/**
 * LeetCode Activity Feed Component
 * 
 * Displays a user's recent LeetCode submissions with enriched metadata
 * 
 * @param {Object} props
 * @param {string} props.username - LeetCode username to fetch data for
 * @param {number} props.limit - Number of submissions to display (default: 15)
 * @param {boolean} props.showStats - Whether to show statistics summary (default: true)
 */
export default function LeetCodeActivityFeed({ 
  username = 'Shrage', 
  limit = 15,
  showStats = true 
}) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/leetcode/activity-feed?username=${encodeURIComponent(username)}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setActivity(data.data);
          
          // Calculate stats
          const newStats = {
            total: data.data.length,
            accepted: data.data.filter(item => item.status === 'Accepted').length,
            easy: data.data.filter(item => item.difficulty === 'Easy').length,
            medium: data.data.filter(item => item.difficulty === 'Medium').length,
            hard: data.data.filter(item => item.difficulty === 'Hard').length
          };
          setStats(newStats);
        } else {
          throw new Error(data.message || 'Failed to fetch activity');
        }
      } catch (err) {
        console.error('Failed to fetch LeetCode activity:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchActivity();
    }
  }, [username, limit]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Hard':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Accepted') {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-black border border-cyan-400/30 rounded-lg p-8">
        <div className="flex items-center justify-center gap-3">
          <Terminal className="w-6 h-6 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-mono">Loading activity feed...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-red-400/30 rounded-lg p-8">
        <div className="flex items-center gap-3 text-red-400">
          <XCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold mb-1">Failed to load activity</h3>
            <p className="text-sm text-red-400/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div className="bg-black border border-cyan-400/30 rounded-lg p-8">
        <div className="text-center text-cyan-400/70">
          <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent submissions found for {username}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-black border border-cyan-400/30 rounded-lg p-4">
            <div className="text-cyan-400/70 text-xs mb-1">TOTAL</div>
            <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
          </div>
          <div className="bg-black border border-green-400/30 rounded-lg p-4">
            <div className="text-green-400/70 text-xs mb-1">ACCEPTED</div>
            <div className="text-2xl font-bold text-green-400">{stats.accepted}</div>
          </div>
          <div className="bg-black border border-green-400/30 rounded-lg p-4">
            <div className="text-green-400/70 text-xs mb-1">EASY</div>
            <div className="text-2xl font-bold text-green-400">{stats.easy}</div>
          </div>
          <div className="bg-black border border-yellow-400/30 rounded-lg p-4">
            <div className="text-yellow-400/70 text-xs mb-1">MEDIUM</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
          </div>
          <div className="bg-black border border-red-400/30 rounded-lg p-4">
            <div className="text-red-400/70 text-xs mb-1">HARD</div>
            <div className="text-2xl font-bold text-red-400">{stats.hard}</div>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="bg-black border border-cyan-400/30 rounded-lg overflow-hidden">
        <div className="border-b border-cyan-400/30 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-cyan-400 tracking-wider">
              RECENT ACTIVITY
            </h3>
          </div>
        </div>

        <div className="divide-y divide-cyan-400/10">
          {activity.map((item, idx) => (
            <div
              key={`${item.slug}-${idx}`}
              className="p-4 hover:bg-cyan-400/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(item.status)}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors truncate"
                    >
                      {item.title}
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded border ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                      {item.lang}
                    </span>
                    {item.tags.slice(0, 3).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-2 py-1 rounded bg-cyan-400/10 text-cyan-400/70 border border-cyan-400/20"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-cyan-400/50">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-xs text-cyan-400/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(item.timestamp)}
                  </div>
                  {item.isPaidOnly && (
                    <span className="px-2 py-1 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-cyan-400/50">
        <a
          href={`https://leetcode.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
        >
          <Code className="w-3 h-3" />
          View full profile on LeetCode
        </a>
      </div>
    </div>
  );
}
