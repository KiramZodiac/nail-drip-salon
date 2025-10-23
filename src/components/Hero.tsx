import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [direction, setDirection] = useState(0);
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
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
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
      <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-60"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
        <h2 className="mt-8 text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight">
          Nail Drip Salon
        </h2>
        <p className="text-sm text-slate-500 mt-3 animate-pulse">
          Preparing your experience
        </p>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Nail Drip Salon
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your premier destination for luxury nail care and beauty services
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/booking')}
            className="px-12 py-6 text-lg font-semibold rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
          >
            <Calendar size={20} className="mr-3" />
            Book Appointment
          </Button>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 lg:px-12">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7 }}
              className="text-center space-y-6 md:space-y-8"
            >
              {currentSlideData.subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block"
                >
                  <span className="text-sm md:text-base lg:text-lg font-medium tracking-wider uppercase text-white/90 px-6 py-2 border border-white/30 rounded-full backdrop-blur-sm bg-white/10">
                    {currentSlideData.subtitle}
                  </span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight"
              >
                {currentSlideData.title}
              </motion.h1>

              {currentSlideData.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light"
                >
                  {currentSlideData.description}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Static Book Appointment Button */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-24 md:pb-32">
        <Button
          size="lg"
          onClick={() => navigate('/booking')}
          className="px-10 md:px-14 py-6 md:py-7 text-base md:text-lg font-semibold rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:scale-105"
        >
          <Calendar size={20} className="mr-3" />
          Book Appointment
        </Button>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-12 h-2 bg-white shadow-lg' 
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
          <motion.div
            key={currentSlide}
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 7, ease: "linear" }}
          />
        </div>
      )}
    </section>
  );
};

export default Hero;