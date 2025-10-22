
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Play, Image as ImageIcon } from "lucide-react";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: string} | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Fetch gallery images from database
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching gallery images:', error);
        } else {
          setImages(data || []);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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

  const displayImages = activeCategory === "all" 
    ? images 
    : images.filter(image => {
        // Handle case-insensitive matching and category mapping
        const imageCategory = image.category?.toLowerCase() || '';
        const activeCategoryLower = activeCategory.toLowerCase();
        
        // Map tab values to database categories
        const categoryMap: { [key: string]: string[] } = {
          'manicure': ['manicures'],
          'pedicure': ['pedicures'],
          'extensions': ['extensions'],
          'art': ['nail art', 'nailart']
        };
        
        if (categoryMap[activeCategoryLower]) {
          return categoryMap[activeCategoryLower].some(cat => 
            imageCategory.includes(cat.toLowerCase())
          );
        }
        
        return imageCategory.includes(activeCategoryLower);
      });

  const handleMediaClick = (image: GalleryImage) => {
    const mediaUrl = image.media_type === 'video' ? image.video_url : image.image_url;
    setSelectedMedia({url: mediaUrl || '', type: image.media_type});
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMedia(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-nail-lavender py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Nail Gallery</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Browse our gallery of beautiful nail designs created by our talented nail artists at Nail Drip Nails.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4 ">
          <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
            <div className="w-full mb-8">
              <TabsList ref={tabsListRef} className="bg-gray-100 w-full overflow-x-auto scrollbar-hide !p-0 justify-start sm:justify-center">
                <div className="flex min-w-max gap-1 p-1 pl-4 pr-4 sm:pl-1 sm:pr-1">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0 ml-1 sm:ml-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("all"), 100)}
                  >
                    All Designs
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
                </div>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <GalleryGrid images={displayImages} loading={loading} onImageClick={handleMediaClick} />
            </TabsContent>
            
            <TabsContent value="manicure" className="mt-0">
              <GalleryGrid images={displayImages} loading={loading} onImageClick={handleMediaClick} />
            </TabsContent>
            
            <TabsContent value="pedicure" className="mt-0">
              <GalleryGrid images={displayImages} loading={loading} onImageClick={handleMediaClick} />
            </TabsContent>
            
            <TabsContent value="extensions" className="mt-0">
              <GalleryGrid images={displayImages} loading={loading} onImageClick={handleMediaClick} />
            </TabsContent>
            
            <TabsContent value="art" className="mt-0">
              <GalleryGrid images={displayImages} loading={loading} onImageClick={handleMediaClick} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-nail-pink">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Love What You See?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Book an appointment with our talented nail artists to get your own custom design.
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

      {/* Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200 z-10"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
            
            {selectedMedia.type === 'video' ? (
              <video 
                src={selectedMedia.url} 
                controls
                autoPlay
                className="w-full h-auto max-h-[90vh] object-contain"
                onEnded={closeModal}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={selectedMedia.url} 
                alt="Enlarged nail design" 
                className="w-full h-auto object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  video_url: string | null;
  media_type: string;
  category: string | null;
  tags: string[] | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  display_order: number | null;
}

interface GalleryImageProps {
  image: GalleryImage;
  onClick: (image: GalleryImage) => void;
}

// Helper component for rendering gallery grid
const GalleryGrid = ({ 
  images, 
  loading, 
  onImageClick 
}: { 
  images: GalleryImage[], 
  loading: boolean, 
  onImageClick: (image: GalleryImage) => void 
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading gallery...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No images found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <GalleryImage image={image} onClick={onImageClick} />
        </motion.div>
      ))}
    </div>
  );
};

const GalleryImage = ({ image, onClick }: GalleryImageProps) => {
  const isVideo = image.media_type === 'video';
  const mediaUrl = isVideo ? image.video_url : image.image_url;

  return (
    <motion.div 
      className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 group relative"
      onClick={() => onClick(image)}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-64 overflow-hidden relative">
        {isVideo ? (
          <video 
            src={mediaUrl || ''} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            poster={image.image_url} // Use image_url as poster/thumbnail
            preload="metadata"
          />
        ) : (
          <img 
            src={mediaUrl || ''} 
            alt={image.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        )}
        
        {/* Play button overlay for videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300">
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-nail-purple ml-1" />
            </div>
          </div>
        )}
        
        {/* Media type indicator */}
        <div className="absolute top-2 right-2">
          {isVideo ? (
            <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg">
              <Play className="w-3 h-3" />
            </div>
          ) : (
            <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
              <ImageIcon className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
        <div className="p-4 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-medium text-lg">{image.title}</h3>
          {image.description && (
            <p className="text-white text-sm opacity-90 mt-1">{image.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Gallery;
