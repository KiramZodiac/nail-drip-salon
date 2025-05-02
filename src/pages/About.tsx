
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Nail, Clock, Users, Star } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Isabella Johnson",
      role: "Founder & Master Nail Artist",
      bio: "With over 15 years of experience, Isabella founded Nagaayi Nails with a vision of creating a luxurious yet welcoming nail salon that focuses on quality and client care.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Senior Nail Technician",
      bio: "Known for his precision and attention to detail, Michael specializes in intricate nail art designs and has won multiple awards for his creative work.",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Sophia Rodriguez",
      role: "Nail Artist & Educator",
      bio: "Sophia brings her artistic background to create stunning nail designs. She also leads our nail technician training program and keeps our team updated on the latest techniques.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const values = [
    {
      icon: <Star className="h-8 w-8 text-nail-purple" />,
      title: "Quality First",
      description: "We use only premium products and maintain the highest standards of service for our clients."
    },
    {
      icon: <Users className="h-8 w-8 text-nail-purple" />,
      title: "Client Satisfaction",
      description: "Your happiness is our priority. We tailor our services to meet your specific preferences and needs."
    },
    {
      icon: <Nail className="h-8 w-8 text-nail-purple" />,
      title: "Creativity & Innovation",
      description: "We constantly explore new techniques and designs to offer you the latest in nail fashion."
    },
    {
      icon: <Clock className="h-8 w-8 text-nail-purple" />,
      title: "Professionalism",
      description: "Our team is committed to punctuality, courtesy, and maintaining a clean, relaxing environment."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-nail-lavender py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Nagaayi Nails</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Discover the story behind our premium nail salon and the passionate team dedicated to your nail care.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <div className="w-20 h-1 bg-nail-purple mb-6"></div>
              <p className="text-gray-700 mb-4">
                Founded in 2018, Nagaayi Nails began with a simple mission: to provide exceptional nail care services in a luxurious yet welcoming environment. Our founder, Isabella Johnson, saw a need for a nail salon that prioritized both quality and client experience.
              </p>
              <p className="text-gray-700 mb-4">
                The name "Nagaayi" derives from a Ugandan word meaning "beautiful," reflecting our commitment to enhancing the natural beauty of every client who walks through our doors.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a small boutique salon has grown into a beloved establishment known for its attention to detail, creative designs, and unparalleled customer service. Our team of skilled nail technicians brings years of experience and a passion for nail artistry.
              </p>
              <p className="text-gray-700">
                Today, we continue to evolve while staying true to our core values: using premium products, maintaining the highest hygiene standards, and ensuring each client leaves feeling beautiful and satisfied.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1604654894609-ec91578d370f?q=80&w=800&auto=format&fit=crop" 
                alt="Nagaayi Nails Salon" 
                className="rounded-lg shadow-lg object-cover h-full"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="text-nail-purple font-semibold text-xl">Since 2018</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              At Nagaayi Nails, our core values guide everything we do, from how we treat our clients to the quality of our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md transition-transform hover:-translate-y-2">
                <div className="bg-nail-pink/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Our skilled team of nail technicians brings years of experience and a passion for nail artistry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-2">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-nail-purple mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-16 bg-nail-pink">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=800&auto=format&fit=crop" 
                alt="Premium Nail Products" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Premium Products</h2>
              <div className="w-20 h-1 bg-nail-purple mb-6"></div>
              <p className="text-gray-700 mb-4">
                At Nagaayi Nails, we believe that exceptional nail services start with high-quality products. We carefully select our polishes, tools, and treatment products from trusted brands that share our commitment to quality and safety.
              </p>
              <p className="text-gray-700 mb-4">
                We prioritize non-toxic, cruelty-free products that are gentle on your nails while providing stunning results. Our gel polishes offer long-lasting wear without damage, and our treatment products nourish and strengthen your natural nails.
              </p>
              <p className="text-gray-700 mb-6">
                Our commitment to using premium products extends to our sanitation practices. We maintain the highest hygiene standards with hospital-grade sterilization equipment and single-use items where appropriate, ensuring your safety and comfort during every visit.
              </p>
              <Button asChild className="bg-nail-purple hover:bg-nail-purple/90">
                <Link to="/services">Explore Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Nagaayi Nails</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Ready to experience our premium nail services? Book an appointment today and let our talented team take care of you.
          </p>
          <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
            <Link to="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
