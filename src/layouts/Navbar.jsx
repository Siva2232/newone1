import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import hhhh from '../assets/hhhh.jpg';

const navLinks = [
  { name: "HOME", path: "/" },
  // { name: "ABOUT US", path: "/about" },
  { name: "PRODUCTS", path: "/models" },
  { name: "Book Album", path: "/custom-book" },
  { name: "SERVICES", path: "/services" },
  // { name: "CONTACT", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent body scroll during transition
  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTransitioning]);

  // Scroll to top only AFTER transition ends and page is fully loaded
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 100); // Small delay to ensure new page is rendered
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isTransitioning]);

  const handleNavClick = (path) => {
    if (location.pathname === path) {
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsTransitioning(true);
    setMobileOpen(false);

    // Navigate after entrance animation
    setTimeout(() => {
      navigate(path);
    }, 400);

    // End transition after exit animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900); // Total duration: entrance (400ms) + loader (500ms)
  };

  return (
    <>
      {/* Smooth Page Transition Loader */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <motion.div
              className="flex gap-3"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-yellow-500 rounded-full"
                  animate={{
                    y: [0, -12, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
          {/* Logo - larger size + no background card */}
          <button
            onClick={() => handleNavClick("/")}
            className="flex items-center gap-5 md:gap-8 hover:opacity-80 transition cursor-pointer"
          >
            <img
              src={hhhh}
              alt="Perfect Digital Press Logo"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain drop-shadow-xl"
            />

            {/* <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-black tracking-wider hidden sm:block">
              PERFECT DIGITAL PRESS
            </span> */}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative text-sm font-medium uppercase tracking-wider transition-colors pb-2 cursor-pointer ${
                    isActive ? "text-black" : "text-gray-600 hover:text-black"
                  }`}
                >
                  {link.name}

                  {/* Unique layoutId per link to avoid conflicts */}
                  {isActive && (
                    <motion.span
                      layoutId={`desktop-underline-${link.path}`}
                      className="absolute -bottom-2 left-0 w-full h-0.5 bg-yellow-500"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Social */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#" aria-label="Facebook" className="cursor-pointer">
              <Facebook size={20} className="text-gray-600 hover:text-yellow-600 transition" />
            </a>
            <a href="#" aria-label="Instagram" className="cursor-pointer">
              <Instagram size={20} className="text-gray-600 hover:text-yellow-600 transition" />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-black z-50 cursor-pointer"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={28} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden fixed inset-x-0 top-20 md:top-24 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xl z-40 pt-6 pb-10"
            >
              <nav className="flex flex-col px-6 space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;

                  return (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className={`py-4 text-left text-lg font-medium uppercase tracking-wider border-b border-gray-100 last:border-0 flex items-center justify-between cursor-pointer ${
                        isActive ? "text-black" : "text-gray-600 hover:text-black"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        // Static dot instead of shared layoutId
                        <span className="text-yellow-500 text-2xl leading-none">•</span>
                      )}
                    </button>
                  );
                })}

                <div className="flex justify-center gap-10 mt-8 pt-6 border-t border-gray-100">
                  <a href="#" aria-label="Facebook" className="cursor-pointer">
                    <Facebook size={26} className="text-gray-600 hover:text-yellow-600 transition" />
                  </a>
                  <a href="#" aria-label="Instagram" className="cursor-pointer">
                    <Instagram size={26} className="text-gray-600 hover:text-yellow-600 transition" />
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}