
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Scissors } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-nail-pink to-nail-lavender fixed w-full top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
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

          <div className="hidden md:block">
            <Button asChild className="bg-nail-purple hover:bg-nail-purple/90">
              <NavLink to="/booking">Book Now</NavLink>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLink 
              to="/"
              onClick={toggleMenu}
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium py-2" 
                  : "text-gray-700 hover:text-nail-purple transition-colors py-2"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/services"
              onClick={toggleMenu}
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium py-2" 
                  : "text-gray-700 hover:text-nail-purple transition-colors py-2"
              }
            >
              Services
            </NavLink>
            <NavLink 
              to="/gallery"
              onClick={toggleMenu}
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium py-2" 
                  : "text-gray-700 hover:text-nail-purple transition-colors py-2"
              }
            >
              Gallery
            </NavLink>
            <NavLink 
              to="/about"
              onClick={toggleMenu}
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium py-2" 
                  : "text-gray-700 hover:text-nail-purple transition-colors py-2"
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact"
              onClick={toggleMenu}
              className={({ isActive }) => 
                isActive 
                  ? "text-nail-purple font-medium py-2" 
                  : "text-gray-700 hover:text-nail-purple transition-colors py-2"
              }
            >
              Contact
            </NavLink>
            <Button asChild className="bg-nail-purple hover:bg-nail-purple/90 w-full">
              <NavLink to="/booking" onClick={toggleMenu}>Book Now</NavLink>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
