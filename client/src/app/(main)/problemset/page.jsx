"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";

export default function ProblemSetsPage() {
  const [problemSets, setProblemSets] = useState([]);
  const [expandedStep, setExpandedStep] = useState(null);

  const [solvedMap, setSolvedMap] = useState({});
  const [dirty, setDirty] = useState(false);

  // ----------------------------------------
  // LOAD PROBLEMS FROM DATABASE
  // ----------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/problems`, {
          credentials: "include",
        });
        const json = await res.json();

        if (!json.success) return;

        // Group by topic
        const grouped = {};

        json.data.forEach((p) => {
          if (!grouped[p.topic]) grouped[p.topic] = [];
          grouped[p.topic].push(p);
        });

        const processed = Object.entries(grouped).map(
          ([topic, problems], index) => {
            const categories = {
              easy: problems.filter((p) => p.difficulty === "easy").length,
              medium: problems.filter((p) => p.difficulty === "medium").length,
              hard: problems.filter((p) => p.difficulty === "hard").length,
            };

            return {
              id: index + 1,
              title: topic,
              problems: problems.sort((a, b) => a.idx - b.idx),
              total: problems.length,
              categories,
            };
          }
        );

        setProblemSets(processed);
      } catch (e) {
        console.error("Failed loading problems:", e);
      }
    };

    load();
  }, []);

  // ----------------------------------------
  // LOAD USER PROGRESS
  // ----------------------------------------
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/progress`, {
          credentials: "include",
        });

        const json = await res.json();
        if (!json.success) return;

        const map = {};
        json.data.forEach((p) => (map[p.problemId] = true));
        setSolvedMap(map);
      } catch (err) {
        console.error("Failed loading progress:", err);
      }
    };

    loadProgress();
  }, []);

  // ----------------------------------------
  // WARN BEFORE CLOSING WITH UNSAVED CHANGES
  // ----------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // ----------------------------------------
  // CHECKBOX
  // ----------------------------------------
  const toggleProblem = (problemId) => {
    setSolvedMap((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
    setDirty(true);
  };

  // ----------------------------------------
  // SAVE TO SERVER
  // ----------------------------------------
  const saveChanges = async () => {
    try {
      const ops = [];

      for (const [problemId, solved] of Object.entries(solvedMap)) {
        if (solved) {
          ops.push(
            fetch(`${API_BASE}/api/progress/${problemId}`, {
              method: "POST",
              credentials: "include",
            })
          );
        } else {
          ops.push(
            fetch(`${API_BASE}/api/progress/${problemId}`, {
              method: "DELETE",
              credentials: "include",
            })
          );
        }
      }

      await Promise.all(ops);
      setDirty(false);
      alert("Progress saved!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save progress.");
    }
  };

  // ----------------------------------------
  // AGGREGATE STATS
  // ----------------------------------------
  const allProblems = problemSets.flatMap((p) => p.problems);
  const total = allProblems.length;
  const completed = Object.values(solvedMap).filter(Boolean).length;

  const pct = total ? Math.round((completed / total) * 100) : 0;

  const easyTotal = allProblems.filter((p) => p.difficulty === "easy").length;
  const mediumTotal = allProblems.filter((p) => p.difficulty === "medium").length;
  const hardTotal = allProblems.filter((p) => p.difficulty === "hard").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      {dirty && (
        <div className="fixed top-4 right-6 z-50">
          <button
            onClick={saveChanges}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold text-black"
          >
            Save Progress
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-3">NeetCode DSA Roadmap</h1>
        <p className="text-slate-400 mb-6">Your progress synced with your account.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ProgressCard label="Total" value={`${pct}%`} sub={`${completed} / ${total}`} color="text-blue-400" />
          <ProgressCard label="Easy" value={`${allProblems.filter(p => solvedMap[p.id] && p.difficulty === "easy").length} / ${easyTotal}`} color="text-green-400" />
          <ProgressCard label="Medium" value={`${allProblems.filter(p => solvedMap[p.id] && p.difficulty === "medium").length} / ${mediumTotal}`} color="text-yellow-400" />
          <ProgressCard label="Hard" value={`${allProblems.filter(p => solvedMap[p.id] && p.difficulty === "hard").length} / ${hardTotal}`} color="text-red-400" />
        </div>
      </div>

      {/* PROBLEM GROUPS */}
      <div className="max-w-7xl mx-auto space-y-3">
        {problemSets.map((set) => (
          <div key={set.id} className="bg-slate-800/40 border border-slate-700 rounded-lg">
            <button
              onClick={() => setExpandedStep(expandedStep === set.id ? null : set.id)}
              className="w-full p-6 flex items-center gap-4 text-left"
            >
              <ChevronRight
                className={`transition ${expandedStep === set.id ? "rotate-90" : ""}`}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{set.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {set.total} problems — {set.categories.easy} easy • {set.categories.medium} medium • {set.categories.hard} hard
                </p>
              </div>
            </button>

            {expandedStep === set.id && (
              <div className="px-6 pb-6 pt-2 space-y-2 border-t border-slate-700">
                {set.problems.map((p) => {
                  const solved = !!solvedMap[p.id];

                  return (
                    <div key={p.id} className="bg-slate-900/40 border border-slate-700 rounded-lg p-4 flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">#{p.idx}</span>
                          <h4 className="font-medium">{p.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            p.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : p.difficulty === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {p.difficulty}
                          </span>
                        </div>

                        <div className="flex gap-3 text-xs mt-1">
                          <a
                            href={`https://neetcode.io/solutions/${p.id}`}
                            className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            target="_blank"
                          >
                            NeetCode <ExternalLink size={12} />
                          </a>
                          <a
                            href={`https://leetcode.com/problems/${p.id}`}
                            className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                            target="_blank"
                          >
                            LeetCode <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={solved}
                        onChange={() => toggleProblem(p.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

function ProgressCard({ label, value, sub, color }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
      <p className="text-slate-400 text-sm">{label}</p>
      <h2 className={`text-3xl font-bold mt-1 ${color}`}>{value}</h2>
      {sub && <p className="text-slate-400 text-sm mt-1">{sub}</p>}
    </div>
  );
}