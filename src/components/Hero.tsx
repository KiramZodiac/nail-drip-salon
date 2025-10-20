import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (loading) {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-rose-300 to-fuchsia-400 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse"></div>
      
        {/* Elegant spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin-slow"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-pink-200 rounded-full animate-spin"></div>
        </div>
      
        {/* Stylish loading text */}
        <h2 className="mt-8 text-3xl font-extrabold text-white tracking-wide drop-shadow-lg animate-pulse">
        Nail Drip Salon...
        </h2>
        <p className="text-sm text-white/80 mt-2 animate-fade-in">
          Please wait while we prepare your perfect style 💅
        </p>
      
        {/* Subtle shimmer animation */}
        <div className="absolute bottom-10 w-2/3 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
      </section>
      
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen bg-gradient-to-br from-nail-purple to-nail-pink flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Nail Drip Salon</h1>
          <p className="text-xl mb-8">Your beauty destination awaits</p>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images with Parallax Effect */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url(${slide.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Ken Burns Effect - Continuous Zoom Out */}
            <div 
              className={`absolute inset-0 ${
                index === currentSlide 
                  ? 'animate-ken-burns' 
                  : ''
              }`}
              style={{
                backgroundImage: `url(${slide.image_url})`,
                backgroundSize: '120%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/40" />
        
        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-pink-300/40 rounded-full animate-pulse"
              style={{
                width: Math.random() * 6 + 2 + "px",
                height: Math.random() * 6 + 2 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: Math.random() * 5 + "s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl space-y-8">
            {/* Floating gradient background for title */}
            <div className="absolute inset-0 bg-gradient-to-r  animate-gradient-slow blur-3xl"></div>

            {/* Subtitle with transition */}
            {currentSlideData.subtitle && (
            <motion.span
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block text-4xl md:text-5xl font-[Allura] italic tracking-wide bg-gradient-to-r from-[#f9c5d1] via-[#9796f0] to-[#fbc2eb] text-transparent bg-clip-text drop-shadow-[0_2px_20px_rgba(255,192,203,0.4)] animate-shine"
          >
            {currentSlideData.subtitle}
          </motion.span>
            )}

              {/* Title */}
              <motion.h1 
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-6xl md:text-4xl lg:text-2sxl font-bold leading-tight"
              >
                <span className="block bg-gradient-to-r from-white via-white to-gray-100 bg-clip-text text-transparent drop-shadow-2xl">
                  {currentSlideData.title}
                </span>
              </motion.h1>

            {/* Description with transition */}
            {currentSlideData.description && (
              <motion.p 
                key={`description-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow-md"
              >
                {currentSlideData.description}
              </motion.p>
            )}

            {/* Glassy Button with transition */}
            {currentSlideData.button_text && currentSlideData.button_url && (
              <motion.div 
                key={`button-${currentSlide}`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate(currentSlideData.button_url!)}
                  className="relative px-12 py-5 text-lg rounded-full font-semibold overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_#f472b6] bg-gradient-to-r from-pink-500/70 to-purple-500/70 backdrop-blur-lg text-white border border-white/30"
                >
                  <span className="relative z-10">{currentSlideData.button_text}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-glow"></div>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Arrow Navigation */}
          {/* <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button> */}

          {/* Dots Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  index === currentSlide
                    ? 'bg-white scale-125 border-white shadow-lg'
                    : 'bg-white/30 hover:bg-white/60 border-white/50 hover:border-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          {/* <div className="absolute bottom-8 right-8 z-20">
            <button
              onClick={toggleAutoPlay}
              className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg"
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isAutoPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>
          </div> */}
        </>
      )}

      {/* Slide Counter */}
      {slides.length > 1 && (
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/10 text-white px-6 py-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
            <span className="text-sm font-semibold">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 8s ease infinite;
        }

        @keyframes text-shimmer {
          0% { background-position: -200%; }
          100% { background-position: 200%; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 4s linear infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }

        @keyframes slide-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out forwards;
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        @keyframes glow {
          0%, 100% { opacity: 0.2; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
        .animate-glow {
          animation: glow 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
