"use client"

import React, { useState } from 'react';
import { Calendar, Trophy, BookOpen, Target, MessageSquare } from 'lucide-react';

const ProblemSolverDashboard = () => {
  // State for dynamic data - replace with API calls
  const [dashboardData, setDashboardData] = useState({
    todayTask: {
      description: 'Complete 2 Medium DP Problems',
      count: 2
    },
    streak: 15,
    nextSession: {
         date: 'Mon, Oct 24',
      time: '4:00 PM'
    },
    skillLevel: 'Advanced Beginner',
    stats: {
      problemsSolved: 1580,
      topics: 150,
      essays: 43,
      progress: 180, // percentage
      total: 250
    },
    calendar: {
      month: 'October',
      year: 2022,
      solvedDates: [8, 12, 13, 14, 16, 17, 18, 19, 21],
      lastSolved: '2 days ago'
    },
    discussion: {
      text: "Area just started a great discussion on DP, here's my approach.",
      hasNew: true
    }
  });

  // Calendar generation
  const generateCalendar = () => {
    const daysInMonth = 31;
    const startDay = 6; // October 2022 starts on Saturday
    const weeks = [];
    let days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }
    }
    
    // Add remaining days to last week
    if (days.length > 0) {
      while (days.length < 7) {
        days.push(null);
      }
      weeks.push(days);
    }
    
    return weeks;
  };

  const calendarWeeks = generateCalendar();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Hero Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <h1 className="text-4xl font-bold text-center mb-2">
            Become a Stronger Problem Solver
            <br />
            <span className="text-blue-400">— One Session at a Time —</span>
          </h1>
          <p className="text-center text-slate-300 mb-6">
            Unlock your potential with personalized guidance and structured learning path
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-semibold transition-colors">
              Start Today
            </button>
            <button className="bg-blue-500/20 hover:bg-blue-500/30 px-8 py-3 rounded-full font-semibold border border-blue-500/50 transition-colors">
              View Roadmap
            </button>
          </div>
        </div>

        {/* Dashboard Strip */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-4">Personalized Dashboard Strip</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-slate-400 text-sm mb-1">Today's Task:</div>
              <div className="font-semibold">{dashboardData.todayTask.description}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Streak:</div>
              <div className="font-semibold">{dashboardData.streak} Days</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Next Session:</div>
              <div className="font-semibold">{dashboardData.nextSession.date}, {dashboardData.nextSession.time}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Skill Level:</div>
              <div className="font-semibold">{dashboardData.skillLevel}</div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="bg-slate-700/50 p-3 rounded-full">
                <Target className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-xl font-semibold">Your Mentor</span>
            </div>
          </button>
          
          <button className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="bg-slate-700/50 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-xl font-semibold">Your DSA Roadmap</span>
            </div>
          </button>
          
          <button className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="bg-slate-700/50 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-semibold">Challenges</span>
            </div>
          </button>
        </div>

        {/* Stats and Calendar Section */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Calendar */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quick Stats Section</h3>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button className="text-slate-400 hover:text-white">‹</button>
              <div className="text-lg font-semibold">{dashboardData.calendar.month} {dashboardData.calendar.year}</div>
              <button className="text-slate-400 hover:text-white">›</button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-slate-400 text-sm font-semibold">
                  {day}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {calendarWeeks.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm
                        ${day && dashboardData.calendar.solvedDates.includes(day)
                          ? 'bg-blue-500 text-white font-semibold'
                          : day
                          ? 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                          : 'bg-transparent'
                        } transition-colors cursor-pointer`}
                    >
                      {day || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-400">
              Last solved: {dashboardData.calendar.lastSolved}
            </div>
          </div>

          {/* Progress Circle and Stats */}
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex flex-col items-center justify-center">
              {/* Progress Circle */}
              <div className="relative w-48 h-48 mb-6">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - dashboardData.stats.progress / 100)}`}
                    className="text-blue-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold">{dashboardData.stats.progress}%</div>
                  <div className="text-slate-400">{dashboardData.stats.total - dashboardData.stats.progress} {dashboardData.stats.total}</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-8 w-full">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-1">Problems Solved!</div>
                  <div className="text-2xl font-bold">{dashboardData.stats.problemsSolved}</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-1">Topics</div>
                  <div className="text-2xl font-bold">{dashboardData.stats.topics}+</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-1">Essay</div>
                  <div className="text-2xl font-bold text-blue-400">{dashboardData.stats.essays}+</div>
                </div>
              </div>
            </div>

            {/* Community Discussion */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Community / Discussions Teaser</h3>
              <div className="flex gap-4 mb-4">
                <div className="bg-slate-700/50 p-3 rounded-full h-fit">
                  <MessageSquare className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-300 flex-1">
                  {dashboardData.discussion.text}
                </p>
              </div>
              <button className="bg-blue-500/20 hover:bg-blue-500/30 px-6 py-2 rounded-full text-sm font-semibold border border-blue-500/50 transition-colors">
                Join Discussion
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
          <div className="grid grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
              <div className="w-6 h-6 bg-slate-600 rounded"></div>
              <span className="text-sm">Home</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Roadmaps</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Practice</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
              <Target className="w-6 h-6" />
              <span className="text-sm">Potfile</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemSolverDashboard;