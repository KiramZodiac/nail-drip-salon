import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Star, Users, Clock } from "lucide-react";

const Home = () => {
  const [isTestimonialHovered, setIsTestimonialHovered] = useState<number | null>(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      content: "Nagaayi Nails provides the most luxurious nail experience I've ever had. Their attention to detail is unmatched!",
      role: "Regular Client"
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      content: "I love how my nails look after every visit. The staff is professional and the salon is always spotlessly clean.",
      role: "VIP Member"
    },
    {
      id: 3,
      name: "Michelle Lee",
      content: "Best nail art in town! I always receive compliments on my nails. The technicians are true artists!",
      role: "Monthly Client"
    }
  ];

  const features = [
    {
      icon: <Scissors className="h-6 w-6 text-nail-purple" />,
      title: "Premium Products",
      description: "We use only the highest quality, non-toxic nail products for a safer manicure experience."
    },
    {
      icon: <Star className="h-6 w-6 text-nail-purple" />,
      title: "Expert Technicians",
      description: "Our nail artists are certified professionals with years of experience in nail care and design."
    },
    {
      icon: <Users className="h-6 w-6 text-nail-purple" />,
      title: "Personalized Service",
      description: "Each client receives individual attention to ensure their specific nail care needs are met."
    },
    {
      icon: <Clock className="h-6 w-6 text-nail-purple" />,
      title: "Efficient Service",
      description: "We respect your time and ensure prompt service without compromising on quality."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-cover bg-center" style={{ backgroundImage: "url('./public/nails.jpeg')" }}>
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
              Beautiful Nails For Beautiful People
            </h1>
            <p className="text-lg text-gray-700 mb-8 animate-slide-up">
              Experience the art of nail perfection at Nagaayi Nails. Where luxury meets creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
                <Link to="/booking">Book Appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
                <Link to="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-xl mx-auto">
              At Nail Drip Nails, we are committed to providing exceptional nail care services in a relaxing and luxurious environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-md transition-transform hover:-translate-y-2"
              >
                <div className="bg-nail-pink/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Popular Services</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-xl mx-auto">
              Discover our most requested nail treatments and art designs that will leave your nails looking stunning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="service-card bg-white rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=600&auto=format&fit=crop" 
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
            </div>

            <div className="service-card bg-white rounded-lg overflow-hidden">
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
            </div>

            <div className="service-card bg-white rounded-lg overflow-hidden">
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
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-4"></div>
            <p className="text-gray-700 max-w-xl mx-auto">
              Hear from our wonderful clients about their experiences at Nagaayi Nails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className={`relative overflow-hidden transition-all duration-300 ${
                  isTestimonialHovered === testimonial.id ? "shadow-xl -translate-y-2" : "shadow"
                }`}
                onMouseEnter={() => setIsTestimonialHovered(testimonial.id)}
                onMouseLeave={() => setIsTestimonialHovered(null)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={16} 
                        className="text-nail-gold fill-nail-gold mr-1" 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="bg-nail-pink w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="font-medium text-nail-purple">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
              <Link to="/booking">Experience It Yourself</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready For Beautiful Nails?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your appointment today and treat yourself to a luxurious nail experience at Nagaayi Nails.
          </p>
          <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
            <Link to="/booking">Book Your Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
