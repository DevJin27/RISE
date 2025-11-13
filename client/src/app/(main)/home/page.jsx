"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React,{ useState,useEffect } from 'react';
import { Award,TrendingUp,Star,
  Code, BookOpen, BarChart2, ArrowRight, 
  Calendar, Trophy, Activity, Code2, 
  Timer, CheckCircle2, X, Menu, Plus, Users, Clock3, 
  ChevronDown, Award as AwardIcon, BookMarked,Clock,UserCheck
} from 'lucide-react';

// Dummy data - replace with actual API calls
const stats = {
  streak: 12,
  problemsSolved: 87,
  currentRank: 'Platinum',
  weeklyGoal: 15,
  weeklyProgress: 11,
  accuracy: 92,
  avgTime: '1.8m',
  rankProgress: 75,
  xp: 2450,
  nextRank: 'Diamond',
  xpToNextRank: 550
};

const quickActions = [
  {
    id: 1,
    icon: <Plus className="w-5 h-5" />,
    title: "New Problem",
    description: "Start solving a new challenge",
    color: "blue",
    href: "/problems"
  },
  {
    id: 2,
    icon: <BookMarked className="w-5 h-5" />,
    title: "Continue Learning",
    description: "Resume your study plan",
    color: "green",
    href: "/learn"
  },
  {
    id: 3,
    icon: <Trophy className="w-5 h-5" />,
    title: "Join Contest",
    description: "Compete with others",
    color: "yellow",
    href: "/contests"
  },
  {
    id: 4,
    icon: <Users className="w-5 h-5" />,
    title: "Study Group",
    description: "Collaborate with peers",
    color: "purple",
    href: "/study-group"
  }
];

const problemOfTheDay = {
  id: 1,
  title: "Longest Palindromic Substring",
  difficulty: "Medium",
  acceptance: "32.1%",
  likes: 28.7,
  tags: ["String", "Dynamic Programming"],
  description: "Given a string s, return the longest palindromic substring in s.",
  example: "Input: s = 'babad'\nOutput: 'bab' or 'aba'"
};

const studyPlan = {
  currentTopic: "Dynamic Programming",
  progress: 65,
  topics: [
    { id: 1, name: "Arrays & Hashing", completed: true },
    { id: 2, name: "Two Pointers", completed: true },
    { id: 3, name: "Sliding Window", completed: true },
    { id: 4, name: "Stack", completed: true },
    { id: 5, name: "Binary Search", completed: true },
    { id: 6, name: "Linked List", completed: false },
    { id: 7, name: "Trees", completed: false },
    { id: 8, name: "Dynamic Programming", completed: false },
  ]
};

const recentActivity = [
  { 
    id: 1, 
    type: 'solved', 
    problem: 'Valid Parentheses', 
    time: '2h ago', 
    difficulty: 'Easy', 
    points: 10,
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
  },
  { 
    id: 2, 
    type: 'earned', 
    badge: 'Quick Solver', 
    time: '5h ago', 
    icon: <Award className="w-4 h-4 text-yellow-500" />,
    color: 'yellow'
  },
  { 
    id: 3, 
    type: 'solved', 
    problem: 'Linked List Cycle', 
    time: '1d ago', 
    difficulty: 'Medium', 
    points: 15,
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
  },
  { 
    id: 4, 
    type: 'completed', 
    badge: 'Array Master', 
    time: '2d ago', 
    icon: <Trophy className="w-4 h-4 text-purple-500" />,
    color: 'purple'
  },
];

const upcomingContests = [
  { 
    id: 1, 
    name: 'Weekly Challenge #42', 
    time: 'In 2 days', 
    startsIn: '2d 4h 32m',
    duration: '2h', 
    participants: 1245,
    prize: '$500'
  },
  { 
    id: 2, 
    name: 'DSA Sprint', 
    time: 'Next Monday', 
    startsIn: '5d 12h 15m',
    duration: '3h', 
    participants: 874,
    prize: 'Premium Subscription'
  },
  { 
    id: 3, 
    name: 'Beginner Friendly', 
    time: 'Next Friday', 
    startsIn: '9d 6h 45m',
    duration: '2.5h', 
    participants: 0,
    prize: 'Swag Pack'
  },
];

const StatCard = ({ icon, title, value, change, description, color = 'blue' }) => {
  const colorVariants = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-amber-600',
    purple: 'from-purple-500 to-indigo-600',
    red: 'from-red-500 to-pink-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all duration-200 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorVariants[color]} bg-opacity-20`}>
          {React.cloneElement(icon, { className: `w-5 h-5 ${colorVariants[color].split(' ')[0].replace('from-', 'text-')}` })}
        </div>
        {change !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent whitespace-nowrap">
        {value}
      </h3>
      <p className="text-sm text-gray-300 font-medium">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </motion.div>
  );
};

const ProblemCard = ({ problem }) => {
  const [expanded, setExpanded] = useState(false);
  
  const difficultyColors = {
    'Easy': 'bg-green-500/20 text-green-400',
    'Medium': 'bg-yellow-500/20 text-yellow-400',
    'Hard': 'bg-red-500/20 text-red-400'
  };

  return (
    <motion.div 
      layout
      className="bg-gradient-to-br from-gray-800 to-gray-900/80 p-5 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all duration-200 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-lg text-white flex items-center gap-2">
                {problem.title}
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  {problem.acceptance} acceptance
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  {problem.likes}k
                </span>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="overflow-hidden"
            initial={false}
            animate={{ height: expanded ? 'auto' : '3.6em' }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-gray-300 mb-4">
              {problem.description}
            </p>
            {problem.example && (
              <div className="bg-gray-800/50 p-3 rounded-lg text-xs font-mono text-gray-300 mb-4 overflow-x-auto">
                <pre>{problem.example}</pre>
              </div>
            )}
          </motion.div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {problem.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 text-xs rounded-full bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3 ml-4">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <Link 
            href={`/problems/${problem.id}`}
            className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityItem = ({ activity }) => {
  const getActivityIcon = () => {
    if (activity.type === 'solved') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    } else if (activity.type === 'earned' || activity.type === 'completed') {
      return activity.icon || <Award className="w-5 h-5 text-yellow-500" />;
    }
    return <Activity className="w-5 h-5 text-blue-500" />;
  };

  const getActivityText = () => {
    if (activity.type === 'solved') {
      return (
        <>
          Solved <span className="text-white font-medium">{activity.problem}</span>
          <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
            activity.difficulty === 'Easy' 
              ? 'bg-green-500/20 text-green-400' 
              : activity.difficulty === 'Medium' 
              ? 'bg-yellow-500/20 text-yellow-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {activity.difficulty}
          </span>
        </>
      );
    } else if (activity.type === 'earned' || activity.type === 'completed') {
      return (
        <>
          Earned <span className="text-white font-medium">{activity.badge}</span> badge
        </>
      );
    }
    return activity.text;
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
      <div className="p-1.5 rounded-lg bg-gray-700/50">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300">
          {getActivityText()}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{activity.time}</span>
          {activity.points && (
            <span className="text-xs font-medium text-yellow-500">+{activity.points} XP</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ContestCard = ({ contest }) => {
  const getTimeRemaining = (startsIn) => {
    // Simple parsing of the startsIn string
    const daysMatch = startsIn.match(/(\d+)d/);
    const hoursMatch = startsIn.match(/(\d+)h/);
    const minutesMatch = startsIn.match(/(\d+)m/);
    
    const days = daysMatch ? parseInt(daysMatch[1]) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-colors">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-white">{contest.name}</h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
              <Clock3 className="w-4 h-4" />
              <span>Starts in {getTimeRemaining(contest.startsIn)}</span>
            </div>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
            {contest.duration}
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">{contest.participants.toLocaleString()} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <AwardIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-yellow-500">{contest.prize}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-800/80 px-4 py-2.5 border-t border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-400">{contest.time}</span>
        <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  
  // Calculate progress percentages
  const weeklyProgressPercentage = Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100);
  const rankProgressPercentage = stats.rankProgress;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-4 border-b border-gray-700">
            <Code className="w-8 h-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RISE
            </span>
          </div>
          
          <nav className="flex-1 px-3 py-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'overview' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'problems' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <Code2 className="mr-3 h-5 w-5" />
              Problems
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'learn' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Learn
            </button>
            <button
              onClick={() => setActiveTab('contests')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'contests' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <Trophy className="mr-3 h-5 w-5" />
              Contests
            </button>
            <div className="pt-4 mt-4 border-t border-gray-700">
              <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Progress
              </div>
              <div className="px-4 py-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Weekly Goal</span>
                  <span className="font-medium">{stats.weeklyProgress}/{stats.weeklyGoal} problems</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${weeklyProgressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{username || 'User'}</p>
                <p className="text-xs text-gray-400">{stats.currentRank} Rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top Navigation */}
        <header className="bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button 
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:bg-gray-600 focus:ring-0 sm:text-sm"
                  placeholder="Search problems, topics, or users..."
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="ml-4 flex items-center md:ml-6">
                <Link 
                  href="/problemset" 
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Solve Problems
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-100">Dashboard</h1>
              
              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                  title="Current Streak"
                  value={`${stats.streak} days`}
                  change={12}
                  color="blue"
                />
                <StatCard 
                  icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                  title="Problems Solved"
                  value={stats.problemsSolved}
                  change={8}
                  color="green"
                />
                <StatCard 
                  icon={<Award className="w-5 h-5 text-yellow-500" />}
                  title="Current Rank"
                  value={stats.currentRank}
                  color="yellow"
                />
                <StatCard 
                  icon={<Timer className="w-5 h-5 text-purple-500" />}
                  title="Avg. Time"
                  value={stats.avgTime}
                  change={-5}
                  color="purple"
                />
              </div>
              
              {/* Main Content Grid */}
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Problem of the Day */}
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-white">Problem of the Day</h2>
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <ProblemCard 
                        problem={problemOfTheDay}
                        onSolve={() => window.location.href = '/problems/two-sum'}
                      />
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-lg font-medium text-white">Recent Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-700">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                              {activity.type === 'solved' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Award className="h-5 w-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white">
                                  {activity.type === 'solved' 
                                    ? `Solved "${activity.problem}"` 
                                    : `Earned "${activity.badge}" badge`}
                                </p>
                                <span className="text-xs text-gray-400">{activity.time}</span>
                              </div>
                              {activity.type === 'solved' && (
                                <div className="mt-1 flex items-center text-xs text-gray-400">
                                  <span className={`px-2 py-0.5 rounded-full ${
                                    activity.difficulty === 'Easy' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : activity.difficulty === 'Medium' 
                                      ? 'bg-yellow-500/20 text-yellow-400' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {activity.difficulty}
                                  </span>
                                  <span className="ml-2 text-yellow-400 flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    +{activity.points} XP
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-3 bg-gray-800/50 text-center border-t border-gray-700">
                      <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                        View all activity
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-lg font-medium text-white">Quick Actions</h2>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                      {quickActions.map((action) => (
                        <Link
                          key={action.id}
                          href={action.href}
                          className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition-colors"
                        >
                          <div className="mx-auto h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                            {action.icon}
                          </div>
                          <h3 className="text-sm font-medium text-white">{action.title}</h3>
                          <p className="mt-1 text-xs text-gray-400">{action.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Upcoming Contests */}
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h2 className="text-lg font-medium text-white">Upcoming Contests</h2>
                    </div>
                    <div className="divide-y divide-gray-700">
                      {upcomingContests.map((contest) => (
                        <div key={contest.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-purple-500" />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white">{contest.name}</p>
                                <span className="text-xs text-gray-400">{contest.time}</span>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-400">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {contest.duration}
                                </span>
                                <span className="mx-2">•</span>
                                <span className="flex items-center">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  {contest.participants.toLocaleString()} participants
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-3 bg-gray-800/50 text-center border-t border-gray-700">
                      <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                        View all contests
                      </a>
                    </div>
                  </div>
                  
                  {/* Study Plan Progress */}
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-white">Study Plan Progress</h3>
                      <span className="text-xs text-blue-400">2/5 weeks</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      <span className="font-medium text-white">Arrays & Strings</span> • Next up: Hash Maps
                    </p>
                    <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800/50 border-t border-gray-700 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center
              ">
                <Code className="w-6 h-6 text-blue-500" />
                <span className="ml-2 text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  RISE
                </span>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-400">
                © {new Date().getFullYear()} RISE. All rights reserved.
              </div>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}