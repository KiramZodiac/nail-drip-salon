
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">Nail <span className="text-nail-gold">Drip</span></h3>
            <p className="text-gray-600 mb-4">
              Premium nail salon offering a wide range of nail services with the highest quality products and exceptional care.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-nail-purple hover:text-nail-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-nail-purple hover:text-nail-gold transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-nail-purple transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-600 hover:text-nail-purple transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-600 hover:text-nail-purple transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-nail-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-nail-purple transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={18} className="text-nail-purple mr-2 mt-1" />
                <span className="text-gray-600">Najanankumbi Stella, Entebbe Road<br />Opposite Daherz Pharmacy, Kampala, Uganda</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-nail-purple mr-2" />
                <a href="tel:+256758907256" className="text-gray-600 hover:text-nail-purple transition-colors">
                  +256 758 907256
                </a>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-nail-purple mr-2" />
                <a href="mailto:info@naildripnails.com" className="text-gray-600 hover:text-nail-purple transition-colors">
                  info@naildrip.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Nail drip Nails. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <Link to="/privacy-policy" className="hover:text-nail-purple transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="hover:text-nail-purple transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
          
          {/* Created by section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs">
                Created by{' '}
                <a 
                  href="https://kiram.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nail-purple hover:text-nail-gold transition-colors font-medium"
                >
                  Akram Mageye
                </a>
                {' '}• Software Developer
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


