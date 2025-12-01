"use client"

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import Image from "next/image";
// Using public directory for static assets
const avatar = "/avatar.png";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // To-do list state
  const [tasks, setTasks] = useState(["Finish Inkora trade-flow", "Review DP problems"]);
  const [taskInput, setTaskInput] = useState("");
  const [todoOpen, setTodoOpen] = useState(true);
  const [showAllTasks, setShowAllTasks] = useState(false);

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
  const leetcodeUsername = data?.user?.username ?? "";

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
              Hey {data?.user?.realName ?? "Dev"} — here's your progress for today.
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
              <Image
                src={data?.user?.avatarUrl || avatar}
                alt="Profile picture"
                width={56}
                height={56}
                className="rounded-xl object-cover"
              />
              <div>
                <div className="text-lg font-semibold">{data?.user?.realName ?? "Dev"}</div>
                <div className="text-xs text-gray-400">Reputation {data?.user?.reputation}</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">

          {/* LEFT COLUMN (8/12) */}
          <div className="lg:col-span-8 space-y-8">

            {/* TO-DO LIST */}
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white/90">To-do</h2>
                <div className="flex gap-2">
                  {leetcodeUsername && (
                    <a
                      href={`https://leetcode.com/${leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 transition"
                    >
                      LeetCode Profile
                    </a>
                  )}
                  <button onClick={() => setTodoOpen(!todoOpen)} className="text-sm text-blue-400 hover:text-blue-300">
                    {todoOpen ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {todoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex gap-3">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-gray-200 placeholder:text-gray-500"
                      placeholder="Add a task…"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                    <button className="px-4 py-2 rounded-lg bg-blue-500 text-black font-semibold hover:opacity-90 transition" onClick={addTask}>
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(showAllTasks ? tasks : tasks.slice(0, 5)).map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                      >
                        <span>{t}</span>
                        <button className="text-red-400 text-sm hover:text-red-300" onClick={() => deleteTask(showAllTasks ? i : tasks.length - 1 - (tasks.slice(0, 5).length - 1 - i))}>
                          Delete
                        </button>
                      </div>
                    ))}

                    {tasks.length === 0 && (
                      <p className="text-gray-500 text-sm">No tasks yet.</p>
                    )}

                    {tasks.length > 5 && (
                      <button
                        onClick={() => setShowAllTasks(!showAllTasks)}
                        className="w-full py-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        {showAllTasks ? 'Show Less' : `View All (${tasks.length} tasks)`}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </section>

            {/* PROGRESS + SKILLS SNAPSHOT */}
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <h3 className="text-base font-semibold text-white/80 mb-3">Skill Snapshot</h3>
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
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white/90">Recent Submissions</h2>
                <span className="text-xs text-gray-400">Latest 5</span>
              </div>

              <div className="space-y-2.5">
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
          <aside className="lg:col-span-4 space-y-8 min-w-[360px]">

            {/* CALENDAR */}
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-h-[360px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white/90">Activity Calendar</h2>
                <span className="text-xs text-gray-400">Streak {data?.calendar?.streak ?? 0}</span>
              </div>

              <CalendarMini submissionsMap={submissionsMap} />
            </section>

            {/* SKILLS PIE */}
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-h-[260px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white/90">Skills Breakdown</h2>
                <span className="text-xs text-gray-400">By solved</span>
              </div>

              <SkillsPie stats={skillStats} />
            </section>
          </aside>
        </div>

        <div className="h-20" />
      </main>
    </div>
  );
}

/* ---------------------
   SUBCOMPONENTS
---------------------- */

function ProgressCircle({ percent, total, target }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90">
        <circle cx="48" cy="48" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="7" fill="none" />
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke="#3b82f6"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold text-base">{percent}%</span>
        <span className="text-xs text-gray-400">
          {total}/{target}
        </span>
      </div>
    </div>
  );
}

function CalendarMini({ submissionsMap }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const today = () => {
    setCurrentDate(new Date());
  };

  // Build calendar grid
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ empty: true, key: `empty-${i}` });
  }
  
  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const submissions = submissionsMap[dateKey] ?? 0;
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    
    calendarDays.push({
      day,
      date: dateKey,
      submissions,
      isToday,
      key: dateKey
    });
  }

  const getActivityColor = (count) => {
    if (count === 0) return "";
    if (count < 3) return "bg-blue-900/40";
    if (count < 6) return "bg-blue-700/60";
    return "bg-blue-500/80";
  };

  return (
    <div className="space-y-3">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="font-semibold text-sm">{monthNames[month]} {year}</div>
          <button onClick={today} className="text-xs text-blue-400 hover:text-blue-300">
            Today
          </button>
        </div>
        
        <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 font-medium">
        {daysOfWeek.map((day, i) => (
          <div key={i} className="text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item) => {
          if (item.empty) {
            return <div key={item.key} className="aspect-square" />;
          }

          return (
            <div
              key={item.key}
              className={`
                aspect-square flex items-center justify-center rounded-md
                border transition-all cursor-pointer text-xs
                ${item.isToday 
                  ? 'border-blue-400 bg-blue-500/20' 
                  : 'border-white/10 hover:border-white/30'
                }
                ${getActivityColor(item.submissions)}
              `}
              title={`${item.date}: ${item.submissions} submissions`}
            >
              <span className={`${item.isToday ? 'font-bold text-blue-300' : ''}`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-2">
        <span className="text-[10px]">Less</span>
        <div className="w-3 h-3 rounded bg-gray-800 border border-white/10" />
        <div className="w-3 h-3 rounded bg-blue-900/40 border border-white/10" />
        <div className="w-3 h-3 rounded bg-blue-700/60 border border-white/10" />
        <div className="w-3 h-3 rounded bg-blue-500/80 border border-white/10" />
        <span className="text-[10px]">More</span>
      </div>
    </div>
  );
}

function SkillsPie({ stats }) {
  const data = stats.map((s) => ({ name: s.tagName, value: s.solved }));
  const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div className="flex justify-center">
      <PieChart width={240} height={200}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={75}
          innerRadius={40}
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