
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const services = {
    manicure: [
      {
        id: 1,
        name: "Classic Manicure",
        description: "Basic nail care with cuticle treatment, shaping, and polish application.",
        price: "$25",
        duration: "30 mins",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: 2,
        name: "Gel Manicure",
        description: "Long-lasting gel polish with perfect shine that stays chip-free for weeks.",
        price: "$35",
        duration: "45 mins",
        image: "gel.jpeg"
      },
      {
        id: 3,
        name: "Luxury Spa Manicure",
        description: "Premium manicure with exfoliation, extended massage, paraffin wax, and premium polish.",
        price: "$45",
        duration: "60 mins",
        image: "/maicure.jpeg"
      }
    ],
    pedicure: [
      {
        id: 4,
        name: "Classic Pedicure",
        description: "Foot soak, exfoliation, nail care, and polish application.",
        price: "$35",
        duration: "45 mins",
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: 5,
        name: "Gel Pedicure",
        description: "Foot care with long-lasting gel polish application.",
        price: "$45",
        duration: "60 mins",
        image: "/pedi.jpeg"
      },
      {
        id: 6,
        name: "Luxury Spa Pedicure",
        description: "Premium treatment with extended massage, hot stone therapy, and paraffin wax.",
        price: "$60",
        duration: "75 mins",
        image: "/luxPed.jpeg"
      }
    ],
    extensions: [
      {
        id: 7,
        name: "Acrylic Extensions",
        description: "Full set of acrylic extensions with your choice of length and shape.",
        price: "$50",
        duration: "90 mins",
        image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: 8,
        name: "Gel Extensions",
        description: "Natural-looking gel extensions that are lighter and more flexible than acrylic.",
        price: "$60",
        duration: "90 mins",
        image: "Gelx nails.jpeg"
      },
      {
        id: 9,
        name: "Nail Refill",
        description: "Maintenance for existing extensions to keep them looking fresh.",
        price: "$35",
        duration: "60 mins",
        image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=600&auto=format&fit=crop"
      }
    ],
    art: [
      {
        id: 10,
        name: "Basic Nail Art",
        description: "Simple designs like stripes, dots, or ombre effects.",
        price: "$10+",
        duration: "15+ mins",
        image: "/Easy Nail.jpeg"
      },
      {
        id: 11,
        name: "Advanced Nail Art",
        description: "Complex designs, 3D elements, or hand-painted artwork.",
        price: "$25+",
        duration: "30+ mins",
        image: "/art.jpeg"
      },
      {
        id: 12,
        name: "Crystal/Gem Application",
        description: "Application of crystals, gems, or other 3D embellishments to your nails.",
        price: "$15+",
        duration: "20+ mins",
        image: "/Bridal Nails.jpeg"
      }
    ]
  };

  const getAllServices = () => {
    return [
      ...services.manicure,
      ...services.pedicure,
      ...services.extensions,
      ...services.art
    ];
  };

  const displayServices = activeCategory === "all" 
    ? getAllServices() 
    : services[activeCategory as keyof typeof services];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-nail-pink py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-7">Our Services</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Discover our complete range of nail treatments and services designed to pamper you and make your nails look stunning.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  All Services
                </TabsTrigger>
                <TabsTrigger value="manicure" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  Manicures
                </TabsTrigger>
                <TabsTrigger value="pedicure" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  Pedicures
                </TabsTrigger>
                <TabsTrigger value="extensions" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  Extensions
                </TabsTrigger>
                 <TabsTrigger value="art" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white max-sm:hidden">
                  Nail Art
                </TabsTrigger> 
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="manicure" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pedicure" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="extensions" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="art" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Service?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and let our expert nail technicians take care of you.
          </p>
          <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
            <Link to="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden service-card">
      <div className="h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <span className="font-semibold text-nail-purple">{service.price}</span>
        </div>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Duration: {service.duration}</span>
          <Button asChild variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Services;
