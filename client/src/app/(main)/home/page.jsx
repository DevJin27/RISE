"use client"

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // To-do list state
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [todoOpen, setTodoOpen] = useState(true);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskError, setTaskError] = useState(null);
  const [syncing, setSyncing] = useState(false);

const handleSync = async () => {
  setSyncing(true);
  try {
    const res = await fetch(`${API_BASE}/api/leetcode/sync`, {
      method: "PUT",
      credentials: "include",
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    await loadUserStats();  // re-fetch profile
    await loadCharts();     // re-fetch calendar/charts

    toast.success("LeetCode data updated!");
  } catch (err) {
    toast.error("Failed to sync: " + err.message);
  } finally {
    setSyncing(false);
  }
};

  function currentStreak(data) {
  // convert keys to numbers & sort
  const days = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  const DAY = 86400; // seconds
  const today = Math.floor(Date.now() / 1000 / DAY) * DAY;

  let streak = 0;
  let curr = today;

  while (true) {
    if (data[curr] > 0) {
      streak++;
      curr -= DAY;
    } else {
      break;
    }
  }

  return streak;
}

  // Fetch real API
  useEffect(() => {
    let mounted = true;
    
    fetch(`${API_BASE}/api/leetcode/me`,{
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (mounted) {
          // Check if response has success flag and data
          if (json.success && json.data) {
            setData(json.data);
          } else {
            setData(json);
          }
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error("Failed to fetch LeetCode data:", err);
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => (mounted = false);
  }, []);

useEffect(() => {
  let mounted = true;
  setTaskError(null);

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load tasks");

      if (mounted) {
        const sorted = [...(json.data ?? [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTasks(sorted);
      }
    } catch (err) {
      if (mounted) setTaskError(err.message);
    } finally {
      if (mounted) setTasksLoading(false);
    }
  };

  loadTasks();
  return () => { mounted = false };
}, []);

  // Parse submissions map
  const parseSubmissionsMap = (submissionsMapString) => {
    try {
      if (!submissionsMapString) return {};
      const parsed = JSON.parse(submissionsMapString);
      
      // Convert Unix timestamps to date strings
      const dateMap = {};
      Object.entries(parsed).forEach(([timestamp, count]) => {
        const date = new Date(parseInt(timestamp) * 1000);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        dateMap[dateKey] = count;
      });
      
      return dateMap;
    } catch (e) {
      console.error("Error parsing submissions map:", e);
      return {};
    }
  };

  // Helpers
  const totalSolved = data?.leetCodeUser?.totalSolved ?? 0;
  const target = 2500;
  const percent = Math.min(100, Math.round((totalSolved / target) * 100));
  const leetcodeUsername = data?.user?.username ?? "";

  const skillStats = data?.skillStats ?? [];
  const subs = (data?.recentSubmissions ?? []).slice(0, 5);
  const submissionsMap = parseSubmissionsMap(data?.calendar?.submissionsMap);
  const visibleTasks = showAllTasks ? tasks : tasks.slice(0, 5);

const deleteTask = async (taskId) => {
  setTaskError(null);
  const prevTasks = tasks;

  // optimistic delete
  setTasks(current => current.filter(task => task.id !== taskId));

  try {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to delete task");
    }
  } catch (err) {
    setTaskError(err.message);
    setTasks(prevTasks); // rollback
  }
};
const addTask = async () => {
  const title = taskInput.trim();
  if (!title || taskSubmitting) return;

  setTaskSubmitting(true);
  setTaskError(null);

  try {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to create task");

    setTasks(prev => [json.data, ...prev]);
    setTaskInput("");
  } catch (err) {
    setTaskError(err.message);
  } finally {
    setTaskSubmitting(false);
  }
};
const markTaskDone = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isCompleted: true }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to update task");

    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, isCompleted: true } : task
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Thinking...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Failed to load data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 rounded-md bg-blue-500 text-black font-semibold hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
               <button onClick={handleSync} className="px-6 py-2.5 rounded-md bg-blue-500 text-black font-semibold hover:opacity-90 transition">
            Sync LeetCode
          </button>
            </div>
          </div>

          {/* Right - Profile Card */}
          <div className="lg:col-span-3 flex justify-end">
            <div className="w-64 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex gap-4 items-center">
              {data?.user?.avatarUrl ? (
                <img
                  src={data.user.avatarUrl}
                  alt="Profile picture"
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                  {(data?.user?.realName ?? "D")[0]}
                </div>
              )}
              <div>
                <div className="text-lg font-semibold">{data?.user?.realName ?? "Dev"}</div>
                <div className="text-xs text-gray-400">Reputation {data?.user?.reputation ?? 0}</div>
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
      <button 
        onClick={() => setTodoOpen(!todoOpen)} 
        className="text-sm text-blue-400 hover:text-blue-300"
      >
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
      {/* INPUT ROW */}
      <div className="flex gap-3">
        <input
          className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-gray-200 placeholder:text-gray-500"
          placeholder="Add a task…"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          disabled={taskSubmitting}
        />
        <button
          className="px-4 py-2 rounded-lg bg-blue-500 text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          onClick={addTask}
          disabled={taskSubmitting}
        >
          {taskSubmitting ? "Adding..." : "Add"}
        </button>
      </div>

      {taskError && (
        <p className="text-sm text-red-400">{taskError}</p>
      )}

      {/* TASK LIST */}
      <div className="space-y-2">
        {tasksLoading ? (
          <div className="text-sm text-gray-400">Loading tasks…</div>
        ) : visibleTasks.length > 0 ? (
          visibleTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-2 transition ${
                task.isCompleted ? "opacity-60 line-through" : ""
              }`}
            >
              <span>{task.title}</span>

              <div className="flex gap-3">
                {!task.isCompleted && (
                  <button
                    className="text-green-400 text-sm hover:text-green-300"
                    onClick={() => markTaskDone(task.id)}
                  >
                    Done
                  </button>
                )}

                <button
                  className="text-red-400 text-sm hover:text-red-300"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No tasks yet.</p>
        )}
      </div>
    </motion.div>
  )}
</section>


            {/* SKILLS BREAKDOWN + DIFFICULTY DISTRIBUTION */}
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills Pie Chart */}
                <div>
                  <h3 className="text-base font-semibold text-white/80 mb-3">Skills Breakdown</h3>
                  <SkillsPie stats={skillStats.slice(0, 5)} />
                </div>

                {/* Difficulty Distribution */}
                <div>
                  <h3 className="text-base font-semibold text-white/80 mb-3">Difficulty Distribution</h3>
                  <DifficultyPie 
                    easy={data?.leetCodeUser?.easySolved ?? 0}
                    medium={data?.leetCodeUser?.mediumSolved ?? 0}
                    hard={data?.leetCodeUser?.hardSolved ?? 0}
                    total={totalSolved}
                  />
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
                {subs.length > 0 ? subs.map((s) => (
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
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          s.status === "Accepted"
                            ? "bg-green-600"
                            : s.status === "Wrong Answer"
                            ? "bg-red-600"
                            : s.status === "Time Limit Exceeded"
                            ? "bg-orange-600"
                            : s.status === "Runtime Error"
                            ? "bg-purple-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm">No recent submissions</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (4/12) */}
          <aside className="lg:col-span-4 space-y-8 min-w-[360px]">

            {/* CALENDAR */}
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-h-[360px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white/90">Activity Calendar</h2>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Streak</div>
                  <div className="text-lg font-semibold text-orange-400">{currentStreak(data?.calendar?.submissionsMap) || 0} 🔥</div>
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-3">
                Total active days: {data?.calendar?.totalActiveDays ?? 0}
              </div>

              <CalendarMini submissionsMap={submissionsMap} />
            </section>

            {/* PROGRESS OVERVIEW */}
            <section className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 min-h-[260px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white/90">Progress Overview</h2>
              </div>

              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">Total Solved</p>
                  <p className="text-4xl font-bold text-white/90">{totalSolved}</p>
                  <p className="text-xs text-gray-400 mt-1">out of {target} goal</p>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-400 mt-1">{percent}% complete</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                  <div className="text-center p-2 rounded-lg bg-green-500/10">
                    <p className="text-xs text-gray-400">Easy</p>
                    <p className="text-lg font-semibold text-green-400">
                      {data?.leetCodeUser?.easySolved ?? 0}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-yellow-500/10">
                    <p className="text-xs text-gray-400">Medium</p>
                    <p className="text-lg font-semibold text-yellow-400">
                      {data?.leetCodeUser?.mediumSolved ?? 0}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-red-500/10">
                    <p className="text-xs text-gray-400">Hard</p>
                    <p className="text-lg font-semibold text-red-400">
                      {data?.leetCodeUser?.hardSolved ?? 0}
                    </p>
                  </div>
                </div>
              </div>
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

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No skill data available
      </div>
    );
  }

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

function DifficultyPie({ easy, medium, hard, total }) {
  const data = [
    { name: "Easy", value: easy, color: "#22c55e" },
    { name: "Medium", value: medium, color: "#eab308" },
    { name: "Hard", value: hard, color: "#ef4444" }
  ].filter(item => item.value > 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No problems solved yet
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <PieChart width={240} height={180}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={70}
          innerRadius={35}
          paddingAngle={3}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      
      <div className="flex gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-gray-400">Easy: {easy}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="text-gray-400">Medium: {medium}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-gray-400">Hard: {hard}</span>
        </div>
      </div>
    </div>
  );
}
