"use client";

import { Button } from "@/_components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X, Home as HomeIcon, BookHeart, Church, UtensilsCrossed, Image as ImageIcon, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";


const navItems = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Nossa História", path: "/nossa-historia", icon: BookHeart },
  { name: "Casamento", path: "/casamento", icon: Church },
  { name: "Chá de Panela", path: "/cha-de-panela", icon: UtensilsCrossed },
  { name: "Galeria", path: "/galeria", icon: ImageIcon },
  { name: "Contato", path: "/contato", icon: Mail },
];

// Routes that should have transparent overlay navigation at top
const overlayRoutes = [
  "/",
  "/nossa-historia",
  "/cha-de-panela",
  "/casamento",
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
      className={`fixed top-0 left-0 right-0 z-40 h-20 transition-all duration-300 ${
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
              className={`playfair-custom text-xl md:text-2xl font-bold transition-colors duration-300 ${
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

        {/* Mobile Navigation - Opção 1: Sidebar Slide-in */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60] md:hidden"
                onClick={() => setIsOpen(false)}
                style={{ top: 0 }}
              />
              
              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed right-0 w-80 bg-background shadow-2xl md:hidden z-[70] overflow-y-auto border-l border-border"
                style={{ top: 0, bottom: 0, height: '100dvh' }}
              >
                {/* Header fixo com gradiente */}
                <div className="sticky top-0 pt-6 px-6 pb-6 border-b border-border bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="playfair-custom text-xl font-semibold text-foreground">
                      Menu
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Explore nosso site
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav Items com ícones */}
              <nav className="p-4 space-y-2 font-sans">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                          path === item.path
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-foreground/70 hover:bg-secondary/80 hover:text-primary"
                        }`}
                      >
                        {/* Background hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110 relative z-10" />
                        <span className="font-medium relative z-10">{item.name}</span>
                        
                        {path === item.path && (
                          <motion.div
                            layoutId="activeMobileIndicator"
                            className="ml-auto w-2 h-2 rounded-full bg-primary-foreground relative z-10"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer decorativo */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-gradient-to-t from-secondary/30 to-transparent playfair-custom">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-foreground1">
                    José & Márjorie
                  </p>
                  <p className="text-xs text-muted-foreground font-bold">
                    💍 07 de Setembro de 2026
                  </p>
                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};