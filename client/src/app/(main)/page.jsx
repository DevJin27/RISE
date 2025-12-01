"use client"

/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { Menu } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Utility function for classnames
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}>
                <a
                  href={item.href}
                  key={item.title}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-colors">
                  <div className="h-4 w-4 text-gray-300">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-colors">
        <Menu className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  mouseX: externalMouseX
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef(null);
  const internalMouseX = useMotionValue(Infinity);
  const mouseX = externalMouseX || internalMouseX;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const windowHeight = window.innerHeight;
      const triggerZone = 150; // pixels from bottom to trigger show
      
      // Show dock when mouse is near bottom
      if (windowHeight - e.clientY < triggerZone) {
        setIsVisible(true);
        // Clear any existing hide timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else if (!isHovering) {
        // Hide dock when mouse leaves bottom area and not hovering
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 1000); // 1 second delay before hiding
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial hide after 3 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ 
        type: "spring",
        damping: 25,
        stiffness: 300,
        mass: 0.8
      }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      onMouseEnter={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
      className={cn(
        "mx-auto hidden h-20 items-end gap-6 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 px-6 pb-4 md:flex shadow-2xl",
        className
      )}>
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href
}) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  // Base sizes
  const baseSize = 44;
  const baseIconSize = 22;
  
  // Direct transform for better performance
  const scale = useTransform(distance, 
    [-50, 0, 50], 
    [1.3, 1.7, 1.3],
    { clamp: true }
  );
  
  // Optimized spring for smooth transitions
  const smoothScale = useSpring(scale, {
    damping: 15,
    stiffness: 500,
    mass: 0.2,
    restDelta: 0.001
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{
          width: baseSize,
          height: baseSize,
          scale: smoothScale,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500 hover:bg-gray-700/50 text-gray-300 will-change-transform">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-700 bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 text-xs whitespace-pre text-white shadow-lg">
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ width: baseIconSize, height: baseIconSize }} className="flex items-center justify-center">
          {icon}
        </div>
      </motion.div>
    </a>
  );
}