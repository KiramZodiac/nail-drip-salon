import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Star, Heart, Shield } from "lucide-react";
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


  // Animation controls for testimonials auto-scroll
const controls = useAnimation();

useEffect(() => {
  const autoScroll = async () => {
    while (true) {
      // move left (halfway since we duplicated testimonials)
      await controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: 25, // adjust for speed — lower = faster
          ease: "linear",
        },
      });
      controls.set({ x: 0 }); // reset instantly
    }
  };
  autoScroll();
}, [controls]);


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
              src="bg.jpeg" // Using existing image from public folder
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
                      <span className="text-nail-purple font-semibold">${service.price}</span>
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

        {/* Auto-scrolling testimonials */}
              <div className="relative w-full overflow-hidden">
                <motion.div
                  className="flex space-x-6 md:space-x-10"
                  animate={controls}
                >
                  {[...testimonials, ...testimonials].map((t, index) => (
              <Card
                key={index}
                className="flex-shrink-0 w-[300px] md:w-[360px] bg-white border border-gray-100 shadow-md hover:shadow-lg rounded-2xl transition-transform duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl text-nail-purple/20 mb-3">“</div>
                  <p className="text-gray-700 text-sm md:text-base italic leading-relaxed mb-6">
                    {t.content}
                  </p>
                  <div className="text-4xl text-nail-purple/20 -mt-4 transform rotate-180">“</div>

                  {/* Star Rating (always 5) */}
                  <div className="flex justify-center mt-3 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className="text-nail-purple fill-nail-purple mx-0.5"
                      />
                    ))}
                  </div>

                 
                </CardContent>
              </Card>
            ))}
          </motion.div>
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
