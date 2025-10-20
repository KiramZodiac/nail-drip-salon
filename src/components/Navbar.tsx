
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Menu, X, Scissors, Home, Sparkles, GraduationCap, Images, User, Phone, Calendar } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/10 backdrop-blur-md border-b border-white/20 fixed w-full top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink to="/" className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-full shadow-sm hidden sm:flex">
                <Scissors className="h-6 w-6 text-nail-purple" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-nail-purple">
                  Nail <span className="text-nail-gold">Drip</span>
                </h1>
                <span className="text-xs italic text-gray-700 sm:ml-2 hidden sm:block">Beauty at your fingertips</span>
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

          <div className="hidden md:flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="bg-nail-purple hover:bg-nail-purple/90">
                <NavLink to="/booking">Book Now</NavLink>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="sm">
                <NavLink to="/admin/login">Admin</NavLink>
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button 
            className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-nail-purple/10 hover:text-nail-purple hover:border-nail-purple/30 transition-all duration-300"
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

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 z-40"
          >
            <div className="bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-2xl">
              <div className="container mx-auto px-6 py-6">
                {/* Navigation Links */}
                <div className="space-y-2 mb-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <NavLink 
                      to="/"
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/20">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button asChild className="bg-gradient-to-r from-nail-purple to-nail-purple/90 hover:from-nail-purple/90 hover:to-nail-purple/80 w-full py-3 text-white font-medium shadow-lg">
                      <NavLink to="/booking" onClick={toggleMenu} className="flex items-center justify-center space-x-2">
                        <Calendar size={18} />
                        <span>Book Now</span>
                      </NavLink>
                    </Button>
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
