import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Star, Heart, Shield } from "lucide-react";
import Hero from "@/components/Hero";

const Home = () => {
  const [isTestimonialHovered, setIsTestimonialHovered] = useState<number | null>(null);
  const [technicianCount, setTechnicianCount] = useState(0);
  const [polishCount, setPolishCount] = useState(0);

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

  const testimonials = [
    {
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
    }
  ];


  return (
    <div>
      {/* Dynamic Hero Section */}
      <Hero />

      {/* The Nail Boutique Section */}
      <section className="relative py-52 bg-white/50 overflow-hidden">
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

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-900 leading-snug mb-6"
            >
              The Ultimate Luxurious <br />
              Nail Salon Experience
            </motion.h2>

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-20 px-6 lg:px-20">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Popular Services</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-xl mx-auto">
              Discover our most requested nail treatments and art designs that will leave your nails looking stunning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="service-card bg-white rounded-lg overflow-hidden"
            >
              <img 
                src="gel.jpeg" 
                alt="Gel Manicure" 
                className="w-full h-60 object-cover transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Gel Manicure</h3>
                <p className="text-gray-600 mb-4">Long-lasting gel polish with a perfect shine that stays chip-free for weeks.</p>
                <div className="flex justify-between items-center">
                  <span className="text-nail-purple font-semibold">$35</span>
                  <Button asChild variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
                    <Link to="/services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="service-card bg-white rounded-lg overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&auto=format&fit=crop" 
                alt="Nail Extensions" 
                className="w-full h-60 object-cover transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Nail Extensions</h3>
                <p className="text-gray-600 mb-4">Custom-length nail extensions with your choice of design and embellishments.</p>
                <div className="flex justify-between items-center">
                  <span className="text-nail-purple font-semibold">$55</span>
                  <Button asChild variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
                    <Link to="/services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="service-card bg-white rounded-lg overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600&auto=format&fit=crop" 
                alt="Nail Art Designs" 
                className="w-full h-60 object-cover transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Nail Art Designs</h3>
                <p className="text-gray-600 mb-4">Custom nail art from simple patterns to elaborate hand-painted designs.</p>
                <div className="flex justify-between items-center">
                  <span className="text-nail-purple font-semibold">$20+</span>
                  <Button asChild variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
                    <Link to="/services">Learn More</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
            <p className="text-gray-700 max-w-xl mx-auto">
              Hear from our wonderful clients about their experiences at Nagaayi Nails.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="w-full"
              >
                <Card 
                  className={`relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-0 ${
                    isTestimonialHovered === testimonial.id ? "shadow-2xl -translate-y-3 scale-105" : "shadow-lg"
                  }`}
                  onMouseEnter={() => setIsTestimonialHovered(testimonial.id)}
                  onMouseLeave={() => setIsTestimonialHovered(null)}
                  style={{
                    borderRadius: '20px 5px 20px 5px'
                  }}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="mb-3 md:mb-4">
                      <div className="text-3xl md:text-4xl text-nail-purple/20 mb-1 md:mb-2">"</div>
                      <p className="text-gray-800 text-sm md:text-base leading-relaxed font-light italic relative z-10 px-2">
                        {testimonial.content}
                      </p>
                      <div className="text-3xl md:text-4xl text-nail-purple/20 mt-1 md:mt-2 transform rotate-180">"</div>
                    </div>
                    <div className="flex justify-center mt-3 md:mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className="text-nail-purple fill-nail-purple/30 mx-0.5 md:mx-1" 
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
              <Link to="/booking">Experience It Yourself</Link>
            </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready For Beautiful Nails?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Book your appointment today and treat yourself to a luxurious nail experience at Nagaayi Nails.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
                <Link to="/booking">Book Your Appointment</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
