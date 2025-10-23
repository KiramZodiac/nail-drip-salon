import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  button_text: string | null;
  button_url: string | null;
  display_order: number;
}

const Hero = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && slides.length > 1) nextSlide();
    if (isRightSwipe && slides.length > 1) prevSlide();
  };

  if (loading) {
    return (
      <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-rose-300 to-fuchsia-400 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse"></div>
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-transparent border-t-white rounded-full animate-spin-slow"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-pink-200 rounded-full animate-spin"></div>
        </div>
        <h2 className="mt-6 md:mt-8 text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg animate-pulse">
          Nail Drip Salon...
        </h2>
        <p className="text-xs md:text-sm text-white/80 mt-2 animate-fade-in px-4 text-center">
          Please wait while we prepare your perfect style
        </p>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-4">Nail Drip Salon</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 max-w-xs sm:max-w-none">Your beauty destination awaits</p>
        <Button
          size="lg"
          onClick={() => navigate('/booking')}
          className="px-12 sm:px-16 md:px-20 py-5 sm:py-6 md:py-7 text-lg sm:text-xl md:text-2xl font-medium rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 shadow-xl"
        >
          <Calendar size={22} className="mr-2 sm:mr-3" />
          Book Now
        </Button>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative h-screen overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-4 sm:space-y-6">
          {currentSlideData.subtitle && (
            <motion.span
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-200"
            >
              {currentSlideData.subtitle}
            </motion.span>
          )}

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight"
          >
            {currentSlideData.title}
          </motion.h1>

          {currentSlideData.description && (
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xs sm:max-w-sm md:max-w-2xl mx-auto leading-relaxed"
            >
              {currentSlideData.description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Static Book Now Button */}
      <motion.div
    initial={{ scale: 0.95 }}
    animate={{ scale: [0.98, 1.02, 0.98] }} // Slight pulse animation
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className="w-full ..." // Retain existing utility classes
>

      <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-xs sm:max-w-sm md:max-w-md px-4">
        <Button
          size="lg"
          onClick={() => navigate('/booking')}
          className="w-full px-8 sm:px-12 md:px-20 py-5 sm:py-6 md:py-7 text-lg sm:text-xl md:text-2xl font-medium rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 shadow-2xl"
        >
          <Calendar size={20} className="mr-2 sm:mr-3" />
          Book Now
        </Button>
      </div>
</motion.div>
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 sm:bottom-28 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-8 sm:w-10 h-2 bg-white' 
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;