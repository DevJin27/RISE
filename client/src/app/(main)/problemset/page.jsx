"use client"
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Shuffle, ChevronDown, ExternalLink } from 'lucide-react';
import dataset from './data';

// Embedded data - replace this with your full data.json content
const DATA = dataset

const ProblemSetsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedStep, setExpandedStep] = useState(null);
  const [problemSets, setProblemSets] = useState([]);

  useEffect(() => {
    // Process embedded data
    const processedData = DATA.map(step => {
      const allTopics = step.sub_steps.flatMap(sub => sub.topics);
      const total = allTopics.length;
      const completed = 0; // You can track this in localStorage later
      
      const categories = {
        easy: allTopics.filter(t => t.difficulty === 0).length,
        medium: allTopics.filter(t => t.difficulty === 1).length,
        hard: allTopics.filter(t => t.difficulty === 2).length
      };
      
      return {
        ...step,
        id: step.step_no,
        title: step.step_title,
        total,
        completed,
        categories
      };
    });
    
    setProblemSets(processedData);
  }, []);

  const totalProblems = problemSets.reduce((sum, set) => sum + set.total, 0);
  const totalCompleted = problemSets.reduce((sum, set) => sum + set.completed, 0);
  const progressPercent = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  const easyTotal = problemSets.reduce((sum, set) => sum + set.categories.easy, 0);
  const mediumTotal = problemSets.reduce((sum, set) => sum + set.categories.medium, 0);
  const hardTotal = problemSets.reduce((sum, set) => sum + set.categories.hard, 0);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 0: return 'text-green-400';
      case 1: return 'text-yellow-400';
      case 2: return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 0: return 'Easy';
      case 1: return 'Medium';
      case 2: return 'Hard';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">DSA A2Z Course</h1>
        <p className="text-slate-400 text-lg mb-6">
          Master DSA from A to Z in a well-organized and structured manner.
        </p>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-slate-300">
            <span className="text-blue-400 font-semibold">Note:</span> Practice problems from multiple sources. 
            This course provides a structured path through essential DSA topics with curated problems.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Progress</span>
              <span className="text-2xl font-bold text-blue-400">{progressPercent}%</span>
            </div>
            <div className="text-3xl font-bold mb-2">{totalCompleted} / {totalProblems}</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm block mb-2">Easy</span>
            <div className="text-3xl font-bold text-green-400">0 / {easyTotal}</div>
            <div className="text-sm text-slate-400 mt-1">completed</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm block mb-2">Medium</span>
            <div className="text-3xl font-bold text-yellow-400">0 / {mediumTotal}</div>
            <div className="text-sm text-slate-400 mt-1">completed</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm block mb-2">Hard</span>
            <div className="text-3xl font-bold text-red-400">0 / {hardTotal}</div>
            <div className="text-sm text-slate-400 mt-1">completed</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All Problems
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'revision'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Revision
            </button>
          </div>

          <div className="flex-1 flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
              <span className="text-sm">Difficulty</span>
              <ChevronDown size={16} />
            </button>
            <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
              <Shuffle size={18} />
              <span className="text-sm">Pick Random</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problem Sets List */}
      <div className="max-w-7xl mx-auto space-y-3">
        {problemSets.map((set) => (
          <div
            key={set.id}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg hover:border-slate-600 transition-all"
          >
            <button
              onClick={() => setExpandedStep(expandedStep === set.id ? null : set.id)}
              className="w-full p-6 flex items-center gap-4 text-left"
            >
              <ChevronRight
                className={`text-slate-400 transition-transform flex-shrink-0 ${
                  expandedStep === set.id ? 'rotate-90' : ''
                }`}
                size={20}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  Step {set.step_no}: {set.title}
                </h3>
                <div className="flex gap-4 text-sm text-slate-400">
                  <span className="text-green-400">{set.categories.easy} Easy</span>
                  <span className="text-yellow-400">{set.categories.medium} Medium</span>
                  <span className="text-red-400">{set.categories.hard} Hard</span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-slate-400 text-sm">{set.completed} / {set.total}</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(set.completed / set.total) * 100}%` }}
                  />
                </div>
              </div>
            </button>

            {expandedStep === set.id && (
              <div className="px-6 pb-6 border-t border-slate-700 pt-6">
                {set.sub_steps.map((subStep) => (
                  <div key={subStep.sub_step_no} className="mb-6 last:mb-0">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3">
                      {subStep.sub_step_no}. {subStep.sub_step_title}
                    </h4>
                    <div className="space-y-2">
                      {subStep.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-slate-500 text-xs">#{topic.sl_no}</span>
                                <h5 className="text-white font-medium">{topic.question_title}</h5>
                                <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(topic.difficulty)} bg-slate-800`}>
                                  {getDifficultyLabel(topic.difficulty)}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {topic.post_link && (
                                  <a
                                    href={topic.post_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                  >
                                    Article <ExternalLink size={12} />
                                  </a>
                                )}
                                {topic.yt_link && (
                                  <a
                                    href={topic.yt_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                  >
                                    Video <ExternalLink size={12} />
                                  </a>
                                )}
                                {topic.plus_link && (
                                  <a
                                    href={topic.plus_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                  >
                                    Practice <ExternalLink size={12} />
                                  </a>
                                )}
                                {topic.lc_link && (
                                  <a
                                    href={topic.lc_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                                  >
                                    LeetCode <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSetsPage;