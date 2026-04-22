"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Scale } from "lucide-react";
import Button from "./Button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Lawyers", href: "/lawyers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Scale
            className={`h-8 w-8 transition-colors ${
              isScrolled ? "text-secondary" : "text-white"
            }`}
          />
          <div className="flex flex-col">
            <span
              className={`font-serif font-bold text-xl leading-none tracking-tight ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            >
              SHEIKH ALTAF HUSSAIN
            </span>
            <span
              className={`text-xs uppercase tracking-widest mt-1 ${
                isScrolled ? "text-slate-500" : "text-white/80"
              }`}
            >
              Advocates & Legal Consultants
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-secondary ${
                    isScrolled ? "text-slate-700" : "text-white/90"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className={`text-xs uppercase tracking-widest transition-opacity hover:opacity-100 ${
                  isScrolled ? "text-slate-400 opacity-60" : "text-white/40 opacity-70"
                }`}
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className={`md:hidden p-2 rounded-md ${
            isScrolled ? "text-primary hover:bg-slate-100" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden border-t border-slate-100">
          <nav className="flex flex-col py-4 px-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-800 font-medium text-lg px-2 py-2 hover:bg-slate-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

          </nav>
        </div>
      )}
    </header>
  );
}
