import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Star, Heart, Shield, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Hero from "@/components/Hero";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  price: number;
  is_active: boolean | null;
  image_url: string | null;
  display_order: number | null;
}

const Home = () => {
  const [isTestimonialHovered, setIsTestimonialHovered] = useState<number | null>(null);
  const [technicianCount, setTechnicianCount] = useState(0);
  const [polishCount, setPolishCount] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  
  // Video section state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoPlayPromise = useRef<Promise<void> | null>(null);

  // Testimonials scroll state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      rating:5,
      id: 1,
      content: "The most luxurious nail experience I've ever had. Their attention to detail is unmatched!",
    },
    {
      id: 2,
      content: "I love how my nails look after every visit. The staff is professional and the salon is always spotlessly clean.",
    },
    {
      id: 3,
      content: "Best nail art in town! I always receive compliments on my nails. The technicians are true artists!",
    },
    {
      id: 4,
      content: "I've been a customer for years and have never been disappointed. The quality of service is consistently excellent.",
    },
    {
      id: 5,
      content: "The atmosphere is relaxing and the staff is friendly. I always leave feeling refreshed and pampered.",
    },
    {
      id: 6,
      content: "The prices are reasonable and the services are worth every penny. I highly recommend this salon to anyone looking for a great nail experience.",
    },
    {
      id: 7,
      content: "The salon is always clean and the staff is professional. I always leave feeling relaxed and satisfied.",
    },
    {
      id: 9,
      content: "The prices are reasonable and the services are worth every penny. I highly recommend this salon to anyone looking for a great nail experience.",
    },
  ];

  // Auto-scroll testimonials
  useEffect(() => {
    // Clear any existing interval first
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }

    // Only start auto-scroll if not paused
    if (!isAutoScrollPaused) {
      autoScrollRef.current = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 4000); // Change testimonial every 4 seconds
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [isAutoScrollPaused, testimonials.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const toggleAutoScroll = () => {
    console.log('Toggling auto-scroll, current state:', isAutoScrollPaused);
    setIsAutoScrollPaused(!isAutoScrollPaused);
  };

  // Video control functions
  const toggleVideoPlay = async () => {
    if (!videoRef.current || isVideoLoading) return;

    setIsVideoLoading(true);

    try {
      if (isVideoPlaying) {
        // Pause the video
        videoRef.current.pause();
        setIsVideoPlaying(false);
        videoPlayPromise.current = null;
      } else {
        // Play the video
        // Cancel any existing play promise first
        if (videoPlayPromise.current) {
          try {
            await videoPlayPromise.current;
          } catch (error) {
            // Ignore errors from cancelled promises
          }
        }

        // Start new play promise
        videoPlayPromise.current = videoRef.current.play();
        await videoPlayPromise.current;
        setIsVideoPlaying(true);
        videoPlayPromise.current = null;
      }
    } catch (error) {
      // Only log if it's not an AbortError (which is expected when interrupted)
      if (error.name !== 'AbortError') {
        console.log('Video play/pause error:', error);
      }
      // Reset state on error
      setIsVideoPlaying(false);
      videoPlayPromise.current = null;
    } finally {
      setIsVideoLoading(false);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };


  // Fetch services from database
  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(3); // Only show top 3 services for popular services section

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to empty array if there's an error
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  // Counting animation effect
  useEffect(() => {
    const animateCount = (setCount: (value: number) => void, target: number, duration: number) => {
      let startTime: number;
      const startValue = 0;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Start animations with slight delay
    const timer1 = setTimeout(() => animateCount(setTechnicianCount, 10, 1500), 200);
    const timer2 = setTimeout(() => animateCount(setPolishCount, 600, 2000), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Cleanup video promise on unmount
  useEffect(() => {
    return () => {
      if (videoPlayPromise.current) {
        videoPlayPromise.current = null;
      }
    };
  }, []);



  return (
    <div>
      {/* Dynamic Hero Section */}
      <Hero />

      {/* The Nail Boutique Section */}
      <section className="relative py-16 md:py-52 bg-white/50 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <img
              src="main2.jpeg" // Using existing image from public folder
              alt="Nail polish splash"
              className="w-[500px] h-[500px] object-cover rounded-lg drop-shadow-2xl animate"
              loading="lazy"
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>

          {/* Right: Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg text-pink-500 italic font-semibold mb-2"
            >
              The Nail Drip
            </motion.h4>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-900 leading-snug mb-6"
            >
              The Ultimate Luxurious <br />
              Nail Salon Experience
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-gray-600 leading-relaxed mb-6"
            >
              We pride ourselves on delivering a premium service at an affordable
              price. Our highly skilled team is dedicated to going the extra mile
              to ensure our customers' complete satisfaction. <br />
              Our services include Manicures, Pedicures, Nail Dip, Acrylic and Gel
              systems, as well as Nail, Cuticle, and Beauty products.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-12 text-center md:text-left justify-center md:justify-start mt-10"
            >
              <div>
                <h3 className="text-4xl font-bold text-pink-500 ">{technicianCount}+</h3>
                <p className="text-gray-800 text-sm">Professional Technicians</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-pink-500 ">{polishCount}+</h3>
                <p className="text-gray-800 text-sm">Nail Polish Colors</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Service Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-8 md:mt-20 px-6 lg:px-20">
          {[
            { 
              image: "manicure.jpeg", 
              label: "Manicures",
              description: "Artistic nail care"
            },
            { 
              image: "pedicure.jpeg", 
              label: "Pedicures",
              description: "Luxurious foot care"
            },
            { 
              image: "extensions.jpeg", 
              label: "Extensions",
              description: "Premium nail art"
            },
            { 
              image: "products.jpeg", 
              label: "Products",
              description: "Quality essentials"
            },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="bg-gray-100 w-32 h-32 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:bg-gray-50 overflow-hidden" style={{
                borderRadius: '50% 30% 50% 30%'
              }}>
                <img 
                  src={item.image} 
                  alt={item.label}
                  className="w-full h-full object-cover scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-gray-800 text-lg font-semibold tracking-wide mb-1 group-hover:text-nail-purple transition-colors duration-300">
                  {item.label}
                </h3>
                <p className="text-gray-600 text-sm font-light italic">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="pt-12 pb-20 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Popular Nail Services</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-xl mx-auto">
              Discover our most requested nail treatments and art designs that will leave your nails looking stunning.
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="service-card bg-white rounded-lg overflow-hidden animate-pulse">
                  <div className="w-full h-60 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="service-card bg-white rounded-lg overflow-hidden"
                >
                  <img 
                    src={service.image_url || "placeholder.svg"} 
                    alt={service.name} 
                    className="w-full h-60 object-cover transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {service.description || "Professional nail service with attention to detail."}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-nail-purple font-semibold">UGX {service.price.toLocaleString('en-US')}</span>
                      <Button asChild variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
                        <Link to="/services">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
              <Link to="/services">View All Services</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Our Salon</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take a virtual tour of our luxurious salon and see the quality of our services in action.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[500px] object-cover"
                poster="/main2.jpeg" // Using existing image as poster
                muted={isVideoMuted}
                loop
                playsInline
                preload="metadata"
                onPlay={() => {
                  setIsVideoPlaying(true);
                  setIsVideoLoading(false);
                  videoPlayPromise.current = null;
                }}
                onPause={() => {
                  setIsVideoPlaying(false);
                  setIsVideoLoading(false);
                  videoPlayPromise.current = null;
                }}
                onLoadStart={() => setIsVideoLoading(true)}
                onCanPlay={() => setIsVideoLoading(false)}
                onError={(e) => {
                  console.log('Video error:', e);
                  setIsVideoLoading(false);
                }}
              >
                {/* You can add your video source here */}
                <source src="/salon-video.mp4" type="video/mp4" />
                <source src="/salon-video.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>

              {/* Video Overlay - Only show when paused or loading */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: isVideoLoading ? 1 : 1.1 }}
                    whileTap={{ scale: isVideoLoading ? 1 : 0.95 }}
                    onClick={toggleVideoPlay}
                    disabled={isVideoLoading}
                    className={`bg-white/90 hover:bg-white text-nail-purple rounded-full p-3 shadow-lg transition-all duration-300 ${
                      isVideoLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Play video"
                  >
                    {isVideoLoading ? (
                      <div className="w-6 h-6 border-2 border-nail-purple border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </motion.button>
                </div>
              )}

              {/* Video Controls - Always visible with higher z-index */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVideoMute}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-all duration-300"
                  aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
                >
                  {isVideoMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {/* Pause Button - Only show when playing and hovering, lower z-index */}
              {isVideoPlaying && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center transition-all duration-300 group z-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVideoPlay}
                    className="bg-white/90 hover:bg-white text-nail-purple rounded-full p-2 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label="Pause video"
                  >
                    <Pause className="w-5 h-5" />
                  </motion.button>
                </div>
              )}

              {/* Video Info Overlay */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Live Experience
                </span>
              </div>
            </div>

            {/* Video Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Watch our skilled technicians create beautiful nail art and provide exceptional service 
                in our state-of-the-art salon environment.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials & Reviews</h2>
          <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover why clients love their experience at Naildrip Nails.
          </p>
        </motion.div>

        {/* Scrollable testimonials */}
        <div 
          className="relative w-full max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoScrollPaused(true)}
          onMouseLeave={() => setIsAutoScrollPaused(false)}
        >
          {/* Navigation buttons */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-nail-purple" />
            </button>
            
            <button
              onClick={toggleAutoScroll}
              className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
              aria-label={isAutoScrollPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            >
              {isAutoScrollPaused ? (
                <Play className="w-6 h-6 text-nail-purple" />
              ) : (
                <Pause className="w-6 h-6 text-nail-purple" />
              )}
            </button>
            
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-nail-purple" />
            </button>
          </div>

          {/* Current testimonial display */}
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-2xl bg-white border border-gray-100 shadow-lg rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="text-4xl text-nail-purple/20 mb-4">"</div>
                <p className="text-gray-700 text-lg md:text-xl italic leading-relaxed mb-6">
                  {testimonials[currentTestimonial]?.content}
                </p>
                <div className="text-4xl text-nail-purple/20 -mt-4 transform rotate-180">"</div>

                {/* Star Rating */}
                <div className="flex justify-center mt-4 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className="text-nail-purple fill-nail-purple mx-1"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial
                    ? "bg-nail-purple scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/booking"
            className="inline-flex items-center justify-center space-x-2 border border-nail-purple text-nail-purple hover:bg-nail-purple/10 font-medium px-8 py-3 rounded-full transition-colors duration-200"
          >
            Experience It Yourself
          </Link>
        </motion.div>
      </div>
    </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Nail Appointment Today</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Book your appointment today and treat yourself to a luxurious nail experience at Naildrip Nails.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/booking" className="inline-flex items-center justify-center space-x-2 bg-nail-purple hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md">
                Book Your Appointment
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
