
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, Users, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  bio: string | null;
  profile_image_url: string | null;
  specialties: string[] | null;
  is_active: boolean | null;
  display_order: number | null;
}

const About = () => {
  const [team, setTeam] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching staff:', error);
        // Fallback to dummy data if database fails
        setTeam([
          {
            id: '1',
            first_name: 'Isabella',
            last_name: 'Johnson',
            role: 'Founder & Master Nail Artist',
            bio: 'With over 15 years of experience, Isabella founded Nail Drip with a vision of creating a luxurious yet welcoming nail salon that focuses on quality and client care.',
            profile_image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
            specialties: ['Nail Art', 'Gel Extensions'],
            is_active: true,
            display_order: 1
          },
          {
            id: '2',
            first_name: 'Michael',
            last_name: 'Chen',
            role: 'Senior Nail Technician',
            bio: 'Known for his precision and attention to detail, Michael specializes in intricate nail art designs and has won multiple awards for his creative work.',
            profile_image_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600&auto=format&fit=crop',
            specialties: ['Nail Art', 'French Manicures'],
            is_active: true,
            display_order: 2
          },
          {
            id: '3',
            first_name: 'Sophia',
            last_name: 'Rodriguez',
            role: 'Nail Artist & Educator',
            bio: 'Sophia brings her artistic background to create stunning nail designs. She also leads our nail technician training program and keeps our team updated on the latest techniques.',
            profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
            specialties: ['Training', 'Nail Art'],
            is_active: true,
            display_order: 3
          }
        ]);
      } else {
        setTeam(data || []);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

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
      icon: <Scissors className="h-8 w-8 text-nail-purple" />,
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
      <section className="bg-nail-lavender py-28">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Nail Drip </h1>
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
                Founded in 2018, Nail Drip began with a simple mission: to provide exceptional nail care services in a luxurious yet welcoming environment. Our founder, Isabella Johnson, saw a need for a nail salon that prioritized both quality and client experience.
              </p>
              <p className="text-gray-700 mb-4">
                The name "Nail Drip" reflecting our commitment to enhancing the natural beauty of every client who walks through our doors.
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
                src="/extensions.jpeg" 
                alt="Nail Drip Salon" 
                className="rounded-lg shadow-lg object-cover h-full"
                loading="lazy"
                decoding="async"
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
              At Nail Drip, our core values guide everything we do, from how we treat our clients to the quality of our services.
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="relative overflow-hidden">
                    <div className="w-full h-96 bg-gray-200"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative overflow-hidden">
                    <img 
                      src={member.profile_image_url || '/placeholder.svg'} 
                      alt={`${member.first_name} ${member.last_name}`}
                      className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
                      style={{
                        imageRendering: 'auto',
                        filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
                        WebkitFilter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
                        objectPosition: 'center 30%'
                      }}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.first_name} {member.last_name}</h3>
                    <p className="text-nail-purple mb-4">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    {member.specialties && member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-nail-pink/20 text-nail-purple text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No team members found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-16 bg-nail-pink">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="pic.jpeg" 
                alt="Premium Nail Products" 
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Premium Products</h2>
              <div className="w-20 h-1 bg-nail-purple mb-6"></div>
              <p className="text-gray-700 mb-4">
                At Nail Drip, we believe that exceptional nail services start with high-quality products. We carefully select our polishes, tools, and treatment products from trusted brands that share our commitment to quality and safety.
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
          <h2 className="text-3xl font-bold mb-4">Experience Nail Drip</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Ready to experience our premium nail services? Book an appointment today and let our talented team take care of you.
          </p>
          <Link to="/booking" className="inline-flex items-center justify-center space-x-2 bg-nail-purple hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md">
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
