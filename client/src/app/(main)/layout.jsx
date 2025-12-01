"use client"
import { FloatingDock } from "./page";
import { Home, FileCode, Waypoints, Sparkles, User } from "lucide-react";

export default function MainLayout({ children }) {

  const navItems = [
    { title: "Home", icon: <Home className="h-full w-full" />, href: "/home" },
    { title: "Problem Set", icon: <FileCode className="h-full w-full" />, href: "/problemset" },
    { title: "Mentor", icon: <Sparkles className="h-full w-full" />, href: "/mentor" },
    { title: "Roadmap", icon: <Waypoints className="h-full w-full" />, href: "/roadmap" },
    { title: "Profile", icon: <User className="h-full w-full" />, href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      
      {/* THIS is the scrollable container the dock listens to */}
      <div
        id="scroll-container"
        className="h-screen overflow-y-auto"
      >
        {children}
      </div>

      <FloatingDock items={navItems} />
    </div>
  );
}
