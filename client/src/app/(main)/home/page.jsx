"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // To-do list state
  const [tasks, setTasks] = useState(["Finish Inkora trade-flow", "Review DP problems"]);
  const [taskInput, setTaskInput] = useState("");
  const [todoOpen, setTodoOpen] = useState(true);

  // Fetch mock API
  useEffect(() => {
    let mounted = true;
    fetch("/api/mock/leetcode")
      .then((res) => res.json())
      .then((json) => mounted && setData(json))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  // Helpers
  const totalSolved = data?.leetCodeUser?.totalSolved ?? 0;
  const target = 2500;
  const percent = Math.min(100, Math.round((totalSolved / target) * 100));

  const skillStats = data?.skillStats ?? [];
  const subs = data?.recentSubmissions ?? [];
  const submissionsMap = data?.calendar?.submissionsMap ?? {};

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([taskInput.trim(), ...tasks]);
    setTaskInput("");
  };
  const deleteTask = (i) => setTasks(tasks.filter((_, x) => x !== i));

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-6 md:px-12 py-12 text-[16px]">
      <main className="max-w-[1700px] mx-auto w-full">

        {/* TOP ROW SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left */}
          <div className="lg:col-span-9 space-y-3">
            <p className="text-sm uppercase tracking-wide text-gray-400">Welcome back</p>
            <h1 className="text-4xl font-semibold text-white/90">
              Hey {data?.user?.realName ?? "Dev"} — here’s your progress for today.
            </h1>
            <p className="text-gray-400 max-w-xl">
              A focused command-center dashboard. Clean, structured and built around your dock.
            </p>

            <div className="flex gap-3 mt-6">
              <button className="px-6 py-2.5 rounded-md bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition font-medium">
                Continue Session
              </button>

              <button className="px-6 py-2.5 rounded-md bg-blue-500 text-black font-semibold hover:opacity-90 transition">
                New Session
              </button>
            </div>
          </div>

          {/* Right - Profile Card */}
          <div className="lg:col-span-3 flex justify-end">
            <div className="w-64 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex gap-4 items-center">
              <img
                src={data?.user?.avatarUrl ?? "/avatar.png"}
                className="w-14 h-14 object-cover rounded-xl"
              />
              <div>
                <div className="text-lg font-semibold">{data?.user?.realName ?? "Dev"}</div>
                <div className="text-xs text-gray-400">Reputation {data?.user?.reputation}</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">

          {/* LEFT COLUMN (8/12) */}
          <div className="lg:col-span-8 space-y-10">

            {/* TO-DO LIST */}
            <section className="glass-section">
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-title">To-do</h2>
                <button onClick={() => setTodoOpen(!todoOpen)} className="text-sm text-blue-400 hover:text-blue-300">
                  {todoOpen ? "Hide" : "Show"}
                </button>
              </div>

              {todoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex gap-3">
                    <input
                      className="flex-1 glass-input"
                      placeholder="Add a task…"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                    />
                    <button className="btn-blue" onClick={addTask}>
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tasks.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                      >
                        <span>{t}</span>
                        <button className="text-red-400 text-sm" onClick={() => deleteTask(i)}>
                          Delete
                        </button>
                      </div>
                    ))}

                    {tasks.length === 0 && (
                      <p className="text-gray-500 text-sm">No tasks yet.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </section>

            {/* PROGRESS + SKILLS SNAPSHOT */}
            <section className="glass-section p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Progress Ring */}
                <div className="flex items-center gap-6">
                  <ProgressCircle percent={percent} total={totalSolved} target={target} />
                  <div>
                    <p className="text-sm text-gray-400">Total solved</p>
                    <p className="text-3xl font-semibold">{totalSolved}</p>
                    <p className="text-sm text-gray-400 mt-2">Goal: {target} problems</p>
                  </div>
                </div>

                {/* Snapshot List */}
                <div>
                  <h3 className="section-subtitle mb-3">Skill Snapshot</h3>
                  <div className="space-y-2">
                    {skillStats.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span>{s.tagName}</span>
                        <span className="font-semibold">{s.solved}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* RECENT SUBMISSIONS */}
            <section className="glass-section">
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-title">Recent Submissions</h2>
                <span className="text-xs text-gray-400">Latest 5</span>
              </div>

              <div className="space-y-3">
                {subs.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition"
                  >
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(s.createdAt).toLocaleString()} · {s.lang}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          s.status === "Accepted"
                            ? "bg-green-600"
                            : s.status === "Wrong Answer"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {s.status}
                      </span>
                      <span className="mt-1 text-xs bg-blue-400 text-black px-2 py-0.5 rounded">
                        {s.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (4/12) */}
          <aside className="lg:col-span-4 space-y-10 min-w-[380px]">

            {/* CALENDAR */}
            <section className="glass-section min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Activity Calendar</h2>
                <span className="text-xs text-gray-400">Streak {data?.calendar?.streak}</span>
              </div>

              <CalendarMini submissionsMap={submissionsMap} />
            </section>

            {/* SKILLS PIE */}
            <section className="glass-section min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Skills Breakdown</h2>
                <span className="text-xs text-gray-400">By solved</span>
              </div>

              <SkillsPie stats={skillStats} />
            </section>
          </aside>
        </div>

        <div className="h-24" />
      </main>
    </div>
  );
}

/* ---------------------
   SUBCOMPONENTS
---------------------- */

// Glass reusable styles
const glassSection = "rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6";
const title = "text-lg font-semibold text-white/90";

function ProgressCircle({ percent, total, target }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-28 h-28 -rotate-90">
        <circle cx="56" cy="56" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={r}
          stroke="#3b82f6"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold text-lg">{percent}%</span>
        <span className="text-xs text-gray-400">
          {total}/{target}
        </span>
      </div>
    </div>
  );
}

function CalendarMini({ submissionsMap }) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, value: submissionsMap[key] ?? 0 });
  }

  const max = Math.max(...days.map((d) => d.value), 1);
  const color = (v) => {
    if (v === 0) return "bg-gray-800";
    if (v < max * 0.33) return "bg-blue-900";
    if (v < max * 0.66) return "bg-blue-700";
    return "bg-blue-500";
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => (
        <div
          key={d.date}
          className={`w-8 h-8 rounded-lg border border-white/10 ${color(d.value)}`}
          title={`${d.date}: ${d.value} submissions`}
        />
      ))}
    </div>
  );
}

function SkillsPie({ stats }) {
  const data = stats.map((s) => ({ name: s.tagName, value: s.solved }));
  const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div className="flex justify-center">
      <PieChart width={260} height={240}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={90}
          innerRadius={45}
          label
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

/* ---------------------
   SHARED STYLES
---------------------- */

function SectionWrapper({ children }) {
  return <section className="glass-section">{children}</section>;
}

// Tailwind shortcuts used in code
// Add to globals.css to make life easier if you want:
// .glass-input { @apply bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-gray-200 placeholder:text-gray-500; }
// .btn-blue   { @apply px-4 py-2.5 rounded-lg bg-blue-500 text-black font-semibold hover:opacity-90 transition; }