"use client";

import { cn } from "@/libs/utils";
import { Menu } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState, useEffect } from "react";

/* ============================================================
   MAIN WRAPPER
   ============================================================ */
export const FloatingDock = ({ items }) => {
  return (
    <>
      <FloatingDockDesktop items={items} />
      <FloatingDockMobile items={items} />
    </>
  );
};

/* ============================================================
   AUTO-HIDE HOOK (WINDOW + DIV SUPPORT)
   ============================================================ */
function useAutoHide() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    // detect your chat scroll container
    const scrollEl =
      document.getElementById("scroll-container") || window;

    const getScrollPos = () =>
      scrollEl === window ? window.scrollY : scrollEl.scrollTop;

    const handleScroll = () => {
      const curr = getScrollPos();

      if (curr > lastY.current + 10) {
        setVisible(false); // scrolling down → hide
      } else if (curr < lastY.current - 10) {
        setVisible(true); // scrolling up → show
      }

      lastY.current = curr;
    };

    scrollEl.addEventListener("scroll", handleScroll);
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, []);

  return visible;
}

/* ============================================================
   MOBILE DOCK — BOTTOM RIGHT FAB
   ============================================================ */
const FloatingDockMobile = ({ items }) => {
  const [open, setOpen] = useState(false);
  const visible = useAutoHide();

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-4 right-4 z-50 md:hidden"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="mobile-nav"
            className="mb-3 flex flex-col gap-2 items-end"
          >
            {items.map((item, idx) => (
              <motion.a
                href={item.href}
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: idx * 0.05 }}
                className="flex h-11 w-11 items-center justify-center rounded-full 
                bg-gray-800/60 backdrop-blur-md border border-gray-700 
                shadow-lg hover:border-blue-400/50 hover:bg-gray-700/40"
              >
                <div className="h-5 w-5 text-gray-300">{item.icon}</div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full 
          bg-gray-900/70 backdrop-blur-xl border border-gray-700 
          shadow-xl hover:border-blue-400/50"
      >
        <Menu className="h-6 w-6 text-gray-300" />
      </button>
    </motion.div>
  );
};

/* ============================================================
   DESKTOP — CENTER BOTTOM FLOATING NAV
   ============================================================ */
const FloatingDockDesktop = ({ items }) => {
  const mouseX = useMotionValue(Infinity);
  const visible = useAutoHide();

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
        "hidden md:flex h-16 items-end gap-6 rounded-2xl px-6 pb-3",
        "bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl"
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

/* ============================================================
   ICON COMPONENT (DESKTOP)
   ============================================================ */
function IconContainer({ mouseX, title, icon, href }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const scale = useTransform(distance, [-100, 0, 100], [1, 1.55, 1], {
    clamp: true,
  });

  const smoothScale = useSpring(scale, {
    damping: 15,
    stiffness: 350,
    mass: 0.15,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ scale: smoothScale }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full
        bg-gray-800/50 backdrop-blur-sm border border-gray-700 
        hover:border-blue-400/50 hover:bg-gray-700/40"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              className="absolute -top-7 left-1/2 px-2 py-0.5 rounded-md text-xs
              bg-gray-900/90 backdrop-blur-md border border-gray-700 
              text-white shadow-lg whitespace-nowrap"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-5 w-5 text-gray-300">{icon}</div>
      </motion.div>
    </a>
  );
}
