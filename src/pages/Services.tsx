
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/SEO";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Function to scroll to make the active tab visible
  const scrollToActiveTab = (activeTab: string) => {
    if (!tabsListRef.current) return;
    
    const container = tabsListRef.current;
    
    // For the first tab (all), ensure it's fully visible from the start
    if (activeTab === "all") {
      container.scrollLeft = 0;
      return;
    }
    
    // Try multiple selectors to find the active tab
    let activeTabElement = container.querySelector(`button[value="${activeTab}"]`) as HTMLElement;
    
    if (!activeTabElement) {
      // Fallback: look for button with data-state="active"
      activeTabElement = container.querySelector(`button[data-state="active"]`) as HTMLElement;
    }
    
    if (!activeTabElement) {
      // Another fallback: look for any button that contains the tab text
      const buttons = container.querySelectorAll('button');
      activeTabElement = Array.from(buttons).find(btn => 
        btn.textContent?.toLowerCase().includes(activeTab.toLowerCase())
      ) as HTMLElement;
    }
    
    if (activeTabElement) {
      // Use scrollIntoView for more reliable scrolling
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  // Handle tab change with auto-scroll
  const handleTabChange = (value: string) => {
    setActiveCategory(value);
    // Use setTimeout to ensure the tab is rendered before scrolling
    setTimeout(() => scrollToActiveTab(value), 200);
  };

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
        } else {
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Scroll to active tab on mount
  useEffect(() => {
    if (activeCategory) {
      setTimeout(() => scrollToActiveTab(activeCategory), 300);
    }
  }, [activeCategory]);

  // Ensure first tab is visible on mount
  useEffect(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft = 0;
    }
  }, []);

  const displayServices = activeCategory === "all" 
    ? services 
    : services.filter(service => {
        // Handle case-insensitive matching and category mapping
        const serviceCategory = service.category.toLowerCase();
        const activeCategoryLower = activeCategory.toLowerCase();
        
        // Map tab values to database categories
        const categoryMap: { [key: string]: string[] } = {
          'manicure': ['manicures'],
          'pedicure': ['pedicures', 'pedicure'],
          'extensions': ['extensions'],
          'art': ['nail art', 'nailart'],
          'repairs': ['repairs']
        };
        
        if (categoryMap[activeCategoryLower]) {
          return categoryMap[activeCategoryLower].some(cat => 
            serviceCategory.includes(cat.toLowerCase())
          );
        }
        
        return serviceCategory.includes(activeCategoryLower);
      });

  return (
    <div>
      <SEO
        title="Professional Nail Services & Treatments"
        description="Discover our complete range of professional nail services including manicures, pedicures, nail art, extensions, and repairs. Expert nail technicians, premium products, and exceptional care at Nail Drip Salon."
        keywords="nail services, manicure, pedicure, nail art, nail extensions, gel nails, acrylic nails, nail repairs, professional nail care, nail technician services"
        canonical="https://naildrip.salon/services"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Professional Nail Services",
          "description": "Complete range of professional nail services including manicures, pedicures, nail art, extensions, and repairs",
          "provider": {
            "@type": "BeautySalon",
            "name": "Nail Drip Salon",
            "url": "https://naildrip.salon"
          },
          "serviceType": "Nail Care Services",
          "areaServed": "United States",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Nail Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Manicure",
                  "description": "Professional nail care and polish application"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Pedicure",
                  "description": "Luxurious foot care and nail treatment"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Nail Art",
                  "description": "Creative and artistic nail designs"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Nail Extensions",
                  "description": "Professional nail extensions and enhancements"
                }
              }
            ]
          }
        }}
      />
      {/* Hero Section */}
      <section className="bg-nail-pink py-28">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-7">Professional Nail Services & Treatments</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Discover our complete range of nail treatments and services designed to pamper you and make your nails look stunning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
            <div className="w-full mb-8">
              <TabsList ref={tabsListRef} className="bg-gray-100 w-full overflow-x-auto scrollbar-hide !p-0 justify-start sm:justify-center">
                <div className="flex min-w-max gap-1 p-1 pl-4 pr-4 sm:pl-1 sm:pr-1">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0 ml-1 sm:ml-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("all"), 100)}
                  >
                    All Services
                  </TabsTrigger>
                  <TabsTrigger 
                    value="manicure" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("manicure"), 100)}
                  >
                    Manicures
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pedicure" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("pedicure"), 100)}
                  >
                    Pedicures
                  </TabsTrigger>
                  <TabsTrigger 
                    value="extensions" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("extensions"), 100)}
                  >
                    Extensions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="art" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("art"), 100)}
                  >
                    Nail Art
                  </TabsTrigger>
                  <TabsTrigger 
                    value="repairs" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("repairs"), 100)}
                  >
                    Repairs
                  </TabsTrigger> 
                </div>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <ServicesGrid services={displayServices} loading={loading} />
            </TabsContent>
            
            <TabsContent value="manicure" className="mt-0">
              <ServicesGrid services={displayServices} loading={loading} />
            </TabsContent>
            
            <TabsContent value="pedicure" className="mt-0">
              <ServicesGrid services={displayServices} loading={loading} />
            </TabsContent>
            
            <TabsContent value="extensions" className="mt-0">
              <ServicesGrid services={displayServices} loading={loading} />
            </TabsContent>
            
            <TabsContent value="art" className="mt-0">
              <ServicesGrid services={displayServices} loading={loading} />
            </TabsContent>
            
            <TabsContent value="repairs" className="mt-0">
              <ServicesGrid services={displayServices} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Schedule Your Nail Service Appointment</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Schedule your appointment today and let our expert nail technicians take care of you.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/booking" className="inline-flex items-center justify-center space-x-2 bg-nail-purple hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md">
                Book an Appointment
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  price: number;
  image_url: string | null;
  display_order: number | null;
}

interface ServiceCardProps {
  service: Service;
}

// Helper component for rendering services grid
const ServicesGrid = ({ services, loading }: { services: Service[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No services found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} mins`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Card className="overflow-hidden service-card">
        <div className="h-48 overflow-hidden">
          <img 
            src={service.image_url || '/placeholder.svg'} 
            alt={service.name} 
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{service.name}</h3>
            <span className="font-semibold text-nail-purple">{formatPrice(service.price)}</span>
          </div>
          <p className="text-gray-600 mb-4">{service.description || 'No description available'}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Duration: {formatDuration(service.duration_minutes)}</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={`/booking?serviceId=${service.id}`} className="inline-flex items-center justify-center space-x-2 border border-nail-purple text-nail-purple hover:bg-nail-purple/10 font-medium px-4 py-2 rounded-full transition-colors duration-200">
                Book Now
              </Link>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Services;
