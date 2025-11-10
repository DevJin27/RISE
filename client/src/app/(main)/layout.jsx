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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {children}
      
      {/* Floating Dock - appears on all pages in (main) */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={navItems} />
      </div>
    </div>
  );
}

