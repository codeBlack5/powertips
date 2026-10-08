import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaTelegramPlane } from "react-icons/fa";
import logo from "../assets/images/power.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Predictions", path: "/history?view=predictions" },
  { label: "Results", path: "/history?view=results" },
  { label: "Favorites", path: "/favorites" },
  { label: "Analysis", path: "/news" },
  { label: "Login", path: "/login" },
  { label: "Register", path: "/register" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile navigation after changing pages.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  // Prevent background scrolling while mobile navigation is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Determine whether a navigation item is currently active.
  const isItemActive = (item) => {
    const currentPath = location.pathname + location.search;

    if (item.path === "/") {
      return location.pathname === "/";
    }

    return currentPath === item.path;
  };

  // One consistent style system for both desktop and mobile.
  const linkClass = (item, mobile = false) => {
    const isActive = isItemActive(item);

    return [
      "flex items-center justify-center rounded-xl",
      "font-bold transition-all duration-200",
      "min-h-[44px]",
      mobile ? "w-full px-4 text-sm" : "px-3 text-sm",
      isActive
        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
        : "text-gray-200 hover:bg-white/10 hover:text-yellow-400",
    ].join(" ");
  };

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-3 sm:px-5 lg:px-8">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="PowerTips home"
        >
          <img
            src={logo}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full border border-yellow-400/30 object-cover shadow-lg shadow-yellow-400/10 sm:h-11 sm:w-11"
          />

          <div className="min-w-0">
            <div className="truncate text-base font-black uppercase tracking-wide text-white sm:text-lg">
              Power<span className="text-yellow-400">Tips</span>
            </div>

            <div className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500 sm:block">
              Football Predictions
            </div>
          </div>
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex lg:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass(item)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-yellow-400 transition-colors hover:bg-white/10 md:hidden"
          aria-label={
            isOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-black/98 px-3 pb-5 pt-3 shadow-2xl md:hidden"
        >
          {/* Mobile header */}
          <div className="mb-3 rounded-2xl border border-yellow-400/10 bg-gradient-to-r from-yellow-400/10 to-transparent p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              PowerTips
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              Football predictions & match analysis
            </p>
          </div>

          {/* Same navigation links as desktop */}
          <div className="grid gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass(item, true)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Telegram */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <a
              href="https://t.me/+g6lqmcWDTpAxZTM0"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 text-sm font-bold text-sky-300 transition-colors hover:bg-sky-500/20"
            >
              <FaTelegramPlane size={18} />
              Join us on Telegram
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

