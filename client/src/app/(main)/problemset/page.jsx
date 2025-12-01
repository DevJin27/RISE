"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Search, Shuffle, ChevronDown, ExternalLink } from "lucide-react";
import newData from "./newData_with_difficulty";

const NEETCODE_DATA = newData;

const ProblemSetsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedStep, setExpandedStep] = useState(null);
  const [problemSets, setProblemSets] = useState([]);

  useEffect(() => {
    const processedData = Object.entries(NEETCODE_DATA).map(
      ([category, problems], index) => {
        const total = problems.length;
        const completed = 0;

        const categories = {
          easy: problems.filter((p) => p.difficulty === "easy").length,
          medium: problems.filter((p) => p.difficulty === "medium").length,
          hard: problems.filter((p) => p.difficulty === "hard").length
        };

        return {
          id: index + 1,
          category_name: category,
          title: category,
          problems,
          total,
          completed,
          categories
        };
      }
    );

    setProblemSets(processedData);
  }, []);

  const totalProblems = problemSets.reduce((sum, set) => sum + set.total, 0);
  const totalCompleted = problemSets.reduce((sum, set) => sum + set.completed, 0);
  const progressPercent =
    totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  const easyTotal = problemSets.reduce((sum, set) => sum + set.categories.easy, 0);
  const mediumTotal = problemSets.reduce((sum, set) => sum + set.categories.medium, 0);
  const hardTotal = problemSets.reduce((sum, set) => sum + set.categories.hard, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">NeetCode DSA Roadmap</h1>
        <p className="text-slate-400 text-lg mb-6">
          Master DSA with NeetCode's curated problem sets organized by topic.
        </p>
        
        {/* Credit Section */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                Course Credit & Attribution
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                This problem set is based on <span className="text-purple-400 font-semibold">NeetCode's DSA Roadmap</span> created by 
                <a 
                  href="https://neetcode.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 mx-1 underline"
                >
                  NeetCode
                </a>
                . All problem selections and course structure are the intellectual property of NeetCode.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                This interface is a <span className="text-cyan-400 font-medium">personal learning tracker</span> built to help track progress through the NeetCode roadmap. I do not claim ownership of the problem curation or learning path.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="https://neetcode.io/roadmap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-purple-500/30"
                >
                  <ExternalLink size={14} />
                  Visit NeetCode Roadmap
                </a>
                <a
                  href="https://www.youtube.com/@NeetCode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-red-500/30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  NeetCode YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-slate-300">
            <span className="text-blue-400 font-semibold">Note:</span> Practice problems from multiple sources. 
            This roadmap provides a structured path through essential DSA topics with curated problems.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Total Progress</span>
            <div className="text-3xl font-bold text-blue-400">
              {progressPercent}%
            </div>
            <div className="text-sm mt-1 text-slate-400">
              {totalCompleted} / {totalProblems}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Easy</span>
            <div className="text-3xl font-bold text-green-400">0 / {easyTotal}</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Medium</span>
            <div className="text-3xl font-bold text-yellow-400">0 / {mediumTotal}</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Hard</span>
            <div className="text-3xl font-bold text-red-400">0 / {hardTotal}</div>
          </div>
        </div>
      </div>

      {/* Problem Sets */}
      <div className="max-w-7xl mx-auto space-y-3">
        {problemSets.map((set) => (
          <div
            key={set.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg"
          >
            <button
              onClick={() =>
                setExpandedStep(expandedStep === set.id ? null : set.id)
              }
              className="w-full p-6 flex items-center gap-4 text-left"
            >
              <ChevronRight
                className={`text-slate-400 transition-transform ${
                  expandedStep === set.id ? "rotate-90" : ""
                }`}
                size={20}
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{set.title}</h3>
                <div className="flex gap-4 text-sm text-slate-400 mt-1">
                  <span>{set.total} Problems</span>
                  <span className="text-green-400">{set.categories.easy} Easy</span>
                  <span className="text-yellow-400">{set.categories.medium} Medium</span>
                  <span className="text-red-400">{set.categories.hard} Hard</span>
                </div>
              </div>
            </button>

            {expandedStep === set.id && (
              <div className="px-6 pb-6 border-t border-slate-700 pt-6">
                <div className="space-y-2">
                  {set.problems.map((problem) => (
                    <div
                      key={problem.idx}
                      className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-500 text-xs">
                              #{problem.idx}
                            </span>
                            <h5 className="font-medium">{problem.name}</h5>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                problem.difficulty === "easy"
                                  ? "bg-green-500/20 text-green-400"
                                  : problem.difficulty === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>

                          <div className="flex gap-3 text-xs mt-1">
                            <a
                              href={`https://neetcode.io/solutions/${problem.id}`}
                              target="_blank"
                              className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                              NeetCode <ExternalLink size={12} />
                            </a>

                            <a
                              href={`https://leetcode.com/problems/${problem.id}`}
                              target="_blank"
                              className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                            >
                              LeetCode <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSetsPage;