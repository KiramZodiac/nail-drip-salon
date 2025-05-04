
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = {
    manicure: [
      {
        id: 1,
        src: "/luxPed.jpeg",
        alt: "Pink Gel Manicure",
        category: "manicure",
        title: "Pink Gel Manicure"
      },
      {
        id: 2,
        src: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=800&auto=format&fit=crop",
        alt: "French Manicure with Flowers",
        category: "manicure",
        title: "French Manicure with Flowers"
      },
      {
        id: 3,
        src: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800&auto=format&fit=crop",
        alt: "Natural Look Manicure",
        category: "manicure",
        title: "Natural Look Manicure"
      },
      {
        id: 4,
        src: "/red.jpeg",
        alt: "Red Classic Manicure",
        category: "manicure",
        title: "Red Classic Manicure"
      },
    ],
    pedicure: [
      {
        id: 5,
        src: "/Gelx nails.jpeg",
        alt: "Spa Pedicure",
        category: "pedicure",
        title: "Spa Pedicure"
      },
      {
        id: 6,
        src: "/pedi.jpeg",
        alt: "Red Pedicure",
        category: "pedicure",
        title: "Red Pedicure"
      },
      {
        id: 7,
        src: "nails.jpeg",
        alt: "French Pedicure",
        category: "pedicure",
        title: "French Pedicure"
      },
    ],
    extensions: [
      {
        id: 8,
        src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800&auto=format&fit=crop",
        alt: "Acrylic Extensions",
        category: "extensions",
        title: "Acrylic Extensions"
      },
      {
        id: 9,
        src: "art.jpeg",
        alt: "Gel Extensions",
        category: "extensions",
        title: "Gel Extensions"
      },
      {
        id: 10,
        src: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=800&auto=format&fit=crop",
        alt: "Crystal Nail Extensions",
        category: "extensions",
        title: "Crystal Nail Extensions"
      },
    ],
    art: [
      {
        id: 11,
        src: "Bridal Nails.jpeg",
        alt: "Floral Nail Art",
        category: "art",
        title: "Floral Nail Art"
      },
      {
        id: 12,
        src: "Easy Nail.jpeg",
        alt: "Gemstone Nail Art",
        category: "art",
        title: "Gemstone Nail Art"
      },
      {
        id: 13,
        src: "maicure.jpeg",
        alt: "Geometric Nail Design",
        category: "art",
        title: "Geometric Nail Design"
      },
      {
        id: 14,
        src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
        alt: "Minimal Nail Art",
        category: "art",
        title: "Minimal Nail Art"
      },
    ]
  };

  const getAllImages = () => {
    return [
      ...images.manicure,
      ...images.pedicure,
      ...images.extensions,
      ...images.art
    ];
  };

  const displayImages = activeCategory === "all" 
    ? getAllImages() 
    : images[activeCategory as keyof typeof images];

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-nail-lavender py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Nail Gallery</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Browse our gallery of beautiful nail designs created by our talented nail artists at Nagaayi Nails.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4 ">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  All Designs
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayImages.map((image) => (
                  <GalleryImage key={image.id} image={image} onClick={() => handleImageClick(image.src)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="manicure" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayImages.map((image) => (
                  <GalleryImage key={image.id} image={image} onClick={() => handleImageClick(image.src)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pedicure" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayImages.map((image) => (
                  <GalleryImage key={image.id} image={image} onClick={() => handleImageClick(image.src)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="extensions" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayImages.map((image) => (
                  <GalleryImage key={image.id} image={image} onClick={() => handleImageClick(image.src)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="art" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayImages.map((image) => (
                  <GalleryImage key={image.id} image={image} onClick={() => handleImageClick(image.src)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-nail-pink">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Love What You See?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Book an appointment with our talented nail artists to get your own custom design.
          </p>
          <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
            <Link to="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged nail design" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface GalleryImageProps {
  image: {
    id: number;
    src: string;
    alt: string;
    category: string;
    title: string;
  };
  onClick: () => void;
}

const GalleryImage = ({ image, onClick }: GalleryImageProps) => {
  return (
    <div 
      className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 group relative"
      onClick={onClick}
    >
      <div className="h-64 overflow-hidden">
        <img 
          src={image.src} 
          alt={image.alt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
        <div className="p-4 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-medium text-lg">{image.title}</h3>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
