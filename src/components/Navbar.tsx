
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Menu, X, Heart, Home, Sparkles, GraduationCap, Images, User, Phone } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle scroll-based navigation visibility and menu closing
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Close mobile menu when scrolling
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }

      // Only apply hide/show behavior on mobile (below md breakpoint)
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past 100px - hide navbar
          setIsNavbarVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show navbar
          setIsNavbarVisible(true);
        }
      } else {
        // Always show navbar on desktop
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen, lastScrollY]);

  // Handle window resize to ensure navbar is visible on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsNavbarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: isNavbarVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/90 backdrop-blur-md border-b border-white/20 fixed w-full top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-2">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink to="/" className="flex items-center gap-3">
              {/* Simple Logo Icon */}
              <div className="relative flex">
                <motion.div 
                  className="bg-white p-1 rounded-full shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="/icon.jpeg" 
                    alt="Nail Drip Icon" 
                    className="h-8 w-8 object-contain rounded-full"
                  />
                </motion.div>
              </div>
              
              {/* Artistic Logo Text */}
              <div className="flex flex-col">
                <div className="relative">
                  <h1 className="text-3xl max-sm:text-2xl sm:text-2xl font-black italic" style={{ 
                    fontFamily: "'Dancing Script', 'Brush Script MT', 'Lucida Handwriting', cursive",
                    letterSpacing: '0.05em'
                  }}>
                    <span className="text-nail-purple">
                      Nail
                    </span>
                    <span className="text-gray-700 ml-2">
                      Drip
                    </span>
                  </h1>
                </div>
                <span className="text-xs italic text-gray-600 font-light mt-1 sm:mt-0 sm:ml-3 sm:inline-block">
                  Beauty at your fingertips
                </span>
              </div>
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium" 
                  : "text-gray-700 hover:text-nail-purple transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/services" 
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium" 
                  : "text-gray-700 hover:text-nail-purple transition-colors"
              }
            >
              Services
            </NavLink>
            <NavLink 
              to="/training" 
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium" 
                  : "text-gray-700 hover:text-nail-purple transition-colors"
              }
            >
              Training
            </NavLink>
            <NavLink 
              to="/gallery" 
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium" 
                  : "text-gray-700 hover:text-nail-purple transition-colors"
              }
            >
              Gallery
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium" 
                  : "text-gray-700 hover:text-nail-purple transition-colors"
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium" 
                  : "text-gray-700 hover:text-nail-purple transition-colors"
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Mobile header buttons */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile menu button */}
            <motion.button 
              className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-nail-purple/10 hover:text-nail-purple hover:border-nail-purple/30 transition-all duration-300"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            ref={menuRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 z-40"
          >
            <div className="bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-2xl">
              <div className="container mx-auto px-3 md:px-6 lg:px-10 xl:px-16 py-2">
                {/* Navigation Links */}
                <div className="space-y-1 mb-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <NavLink 
                      to="/"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-nail-purple/10 text-nail-purple border-l-4 border-nail-purple shadow-sm" 
                            : "text-gray-700 hover:bg-nail-purple/5 hover:text-nail-purple hover:shadow-sm"
                        }`
                      }
                    >
                      <Home size={20} className="flex-shrink-0" />
                      <span className="font-medium">Home</span>
                    </NavLink>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <NavLink 
                      to="/services"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-nail-purple/10 text-nail-purple border-l-4 border-nail-purple shadow-sm" 
                            : "text-gray-700 hover:bg-nail-purple/5 hover:text-nail-purple hover:shadow-sm"
                        }`
                      }
                    >
                      <Sparkles size={20} className="flex-shrink-0" />
                      <span className="font-medium">Services</span>
                    </NavLink>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <NavLink 
                      to="/training"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-nail-purple/10 text-nail-purple border-l-4 border-nail-purple shadow-sm" 
                            : "text-gray-700 hover:bg-nail-purple/5 hover:text-nail-purple hover:shadow-sm"
                        }`
                      }
                    >
                      <GraduationCap size={20} className="flex-shrink-0" />
                      <span className="font-medium">Training</span>
                    </NavLink>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <NavLink 
                      to="/gallery"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-nail-purple/10 text-nail-purple border-l-4 border-nail-purple shadow-sm" 
                            : "text-gray-700 hover:bg-nail-purple/5 hover:text-nail-purple hover:shadow-sm"
                        }`
                      }
                    >
                      <Images size={20} className="flex-shrink-0" />
                      <span className="font-medium">Gallery</span>
                    </NavLink>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <NavLink 
                      to="/about"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-nail-purple/10 text-nail-purple border-l-4 border-nail-purple shadow-sm" 
                            : "text-gray-700 hover:bg-nail-purple/5 hover:text-nail-purple hover:shadow-sm"
                        }`
                      }
                    >
                      <User size={20} className="flex-shrink-0" />
                      <span className="font-medium">About</span>
                    </NavLink>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <NavLink 
                      to="/contact"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-nail-purple/10 text-nail-purple border-l-4 border-nail-purple shadow-sm" 
                            : "text-gray-700 hover:bg-nail-purple/5 hover:text-nail-purple hover:shadow-sm"
                        }`
                      }
                    >
                      <Phone size={20} className="flex-shrink-0" />
                      <span className="font-medium">Contact</span>
                    </NavLink>
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
