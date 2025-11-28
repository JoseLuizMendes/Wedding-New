"use client";

import { Button } from "@/_components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";


const navItems = [
  { name: "Home", path: "/" },
  { name: "Nossa História", path: "/nossa-historia" },
  { name: "Casamento", path: "/casamento" },
  { name: "Chá de Panela", path: "/cha-de-panela" },
  { name: "Galeria", path: "/galeria" },
  { name: "Contato", path: "/contato" },
];

// Routes that should have transparent overlay navigation at top
const overlayRoutes = [
  "/",
  "/nossa-historia",
  "/cha-de-panela",
  "/casamento",
  "/galeria",
  "/contato",
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const navRef = useRef<HTMLElement | null>(null);

  // Check if current route should have overlay behavior
  const isOverlayRoute = overlayRoutes.includes(path as string);
  const isOverlayTop = isOverlayRoute && !scrolled;

  useEffect(() => {
  }, [path]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      setScrolled(window.scrollY > scrollThreshold);
    };

    handleScroll(); // Check initial scroll position
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close when clicking/touching outside the nav (click-outside)
  useEffect(() => {
    if (!isOpen) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("touchstart", onDown);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("touchstart", onDown);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
        isOverlayTop
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md shadow-sm"
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Heart
              className={`w-6 h-6 group-hover:scale-110 transition-all duration-300 ${
                isOverlayTop ? "text-white" : "text-primary"
              }`}
            />
            <span
              className={`font-serif text-xl md:text-2xl font-bold transition-colors duration-300 ${
                isOverlayTop ? "text-white" : "text-foreground"
              }`}>
              José & Márjorie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${
                  path === item.path
                    ? isOverlayTop
                      ? "text-white"
                      : "text-primary"
                    : isOverlayTop
                    ? "text-white/85 hover:text-white"
                    : "text-foreground/70 hover:text-primary"
                }`}>
                {item.name}
                {path === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isOverlayTop ? "bg-white" : "bg-primary"
                    }`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${
              isOverlayTop ? "text-white hover:text-white/80" : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop to cover content behind the mobile menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="md:hidden overflow-hidden relative z-50 bg-background/95 backdrop-blur-md">
                <div className="py-4 space-y-2">
                  {navItems.map(item => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`block px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                        path === item.path
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/70 hover:bg-secondary hover:text-primary"
                      }`}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};