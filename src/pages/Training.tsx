import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users, Award, Star, ChevronRight, Book, Download, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { supabase } from "@/lib/supabase";

interface TrainingCourse {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price_display: string | null;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  max_students: number | null;
  instructor: string | null;
  image_url: string | null;
  video_url: string | null;
  what_you_learn: string[] | null;
  prerequisites: string[] | null;
  certification: string | null;
  schedule: string | null;
  rating: number | null;
  reviews_count: number | null;
}

interface TrainingMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string | null;
  category: 'student-work' | 'classroom' | 'techniques' | 'instructors' | 'facility';
  course_id: string | null;
}

const Training = () => {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [media, setMedia] = useState<TrainingMedia[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeMediaCategory, setActiveMediaCategory] = useState<string>('all');
  const tabsListRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Initialize PDF viewer plugin with default layout
  // Must be called at top level (not inside hooks) as it may use hooks internally
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch training courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('training_courses')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
        } else {
          setCourses(coursesData || []);
        }

        // Fetch training media
        const { data: mediaData, error: mediaError } = await supabase
          .from('training_media')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (mediaError) {
          console.error('Error fetching media:', mediaError);
        } else {
          setMedia(mediaData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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
    setActiveMediaCategory(value);
    // Use setTimeout to ensure the tab is rendered before scrolling
    setTimeout(() => scrollToActiveTab(value), 200);
  };

  // Scroll to active tab on mount
  useEffect(() => {
    if (activeMediaCategory) {
      setTimeout(() => scrollToActiveTab(activeMediaCategory), 300);
    }
  }, [activeMediaCategory]);

  // Ensure first tab is visible on mount
  useEffect(() => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft = 0;
    }
  }, []);

  const filteredMedia = activeMediaCategory === 'all' 
    ? media 
    : media.filter(item => item.category === activeMediaCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Hero Section with Image Background */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/training.jpeg"
          loading="lazy"
          decoding="async" 
          alt="Professional Nail Training"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Professional Nail Training
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Master the art of nail care and design with our comprehensive training programs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-nail-purple hover:bg-nail-purple/90" onClick={() => { document.getElementById('training-gallery')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <Play className="mr-2 h-5 w-5" />
                See Student Work
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById('training-programs')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                View All Courses
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById('training-book')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <Book className="mr-2 h-5 w-5" />
                Training Book
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById('training-requirements')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                View Requirements
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section id="training-programs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Training Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of professional nail training courses designed for every skill level.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onVideoClick={setSelectedVideo} />
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      <section id="training-gallery" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Training Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See our students in action and explore the beautiful work created in our training programs.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
            <div className="w-full mb-8">
              <TabsList ref={tabsListRef} className="bg-gray-100 w-full overflow-x-auto scrollbar-hide !p-0 justify-start sm:justify-center">
                <div className="flex min-w-max gap-1 p-1 pl-4 pr-4 sm:pl-1 sm:pr-1">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0 ml-1 sm:ml-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("all"), 100)}
                  >
                    All Media
                  </TabsTrigger>
                  <TabsTrigger 
                    value="student-work" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("student-work"), 100)}
                  >
                    Student Work
                  </TabsTrigger>
                  <TabsTrigger 
                    value="techniques" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("techniques"), 100)}
                  >
                    Techniques
                  </TabsTrigger>
                  <TabsTrigger 
                    value="classroom" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("classroom"), 100)}
                  >
                    Classroom
                  </TabsTrigger>
                  <TabsTrigger 
                    value="facility" 
                    className="data-[state=active]:bg-nail-purple data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 text-xs sm:text-sm flex-shrink-0"
                    onClick={() => setTimeout(() => scrollToActiveTab("facility"), 100)}
                  >
                    Facility
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard key={item.id} media={item} onVideoClick={setSelectedVideo} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="student-work" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard key={item.id} media={item} onVideoClick={setSelectedVideo} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="techniques" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard key={item.id} media={item} onVideoClick={setSelectedVideo} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="classroom" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard key={item.id} media={item} onVideoClick={setSelectedVideo} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="facility" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard key={item.id} media={item} onVideoClick={setSelectedVideo} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Training Book/PDF Section */}
      <section id="training-book" className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Training Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access our comprehensive training book and educational materials
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Book Icon/Preview */}
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-nail-purple to-nail-pink p-8 rounded-2xl shadow-lg">
                      <Book className="h-24 w-24 text-white" />
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Training Guide Book</h3>
                    <p className="text-gray-600 mb-6">
                      Download our comprehensive training book covering all aspects of professional nail care, 
                      techniques, and best practices. Perfect for students and professionals alike.
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Button
                        size="lg"
                        className="bg-nail-purple hover:bg-nail-purple/90"
                        onClick={() => window.open('/training-book.pdf', '_blank')}
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        View PDF
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-nail-purple text-nail-purple hover:bg-nail-purple/10"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/training-book.pdf';
                          link.download = 'training-book.pdf';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Embedded PDF Viewer - Using react-pdf-viewer for better compatibility */}
                <div className="mt-8 border-t pt-8">
                  <h4 className="text-lg font-semibold mb-4 text-center">Preview</h4>
                  <div className="w-full h-[600px] md:h-[600px] border rounded-lg overflow-hidden bg-gray-100">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer 
                        fileUrl="/training-book.pdf"
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  </div>
                  {/* Additional options */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Need to download or open in a new tab?
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-nail-purple text-nail-purple hover:bg-nail-purple/10"
                        onClick={() => window.open('/training-book.pdf', '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in New Tab
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-nail-purple text-nail-purple hover:bg-nail-purple/10"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/training-book.pdf';
                          link.download = 'training-book.pdf';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="training-requirements" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Training Requirements</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for our comprehensive 3-month nail training program
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Main Package Info */}
            <div className="bg-gradient-to-r from-nail-purple to-nail-pink text-white rounded-2xl p-8 mb-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Complete Training Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold mb-2">2,000,000/=</div>
                  <div className="text-lg opacity-90">Single Student</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">3 Months</div>
                  <div className="text-lg opacity-90">Duration</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">All Included</div>
                  <div className="text-lg opacity-90">Tools & Materials</div>
                </div>
              </div>
            </div>

            {/* Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Essential Tools */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-nail-purple mb-4 flex items-center">
                  <div className="w-2 h-2 bg-nail-purple rounded-full mr-3"></div>
                  Essential Tools
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Side Cutter (02)</span>
                    <span className="font-semibold text-nail-purple">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nail Cutter (02)</span>
                    <span className="font-semibold text-nail-purple">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Buffer</span>
                    <span className="font-semibold text-nail-purple">6,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drill (1 Pack)</span>
                    <span className="font-semibold text-nail-purple">18,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>U.V Lamp</span>
                    <span className="font-semibold text-nail-purple">35,000/=</span>
                  </div>
                </div>
              </div>

              {/* Nail Products */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-nail-purple mb-4 flex items-center">
                  <div className="w-2 h-2 bg-nail-purple rounded-full mr-3"></div>
                  Nail Products
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>O.P.I (1 Pack)</span>
                    <span className="font-semibold text-nail-purple">18,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gel Polish (2 tins)</span>
                    <span className="font-semibold text-nail-purple">40,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Natural Builder (2 tins)</span>
                    <span className="font-semibold text-nail-purple">40,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clear Builder (1 Pack)</span>
                    <span className="font-semibold text-nail-purple">25,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Basecoat & Top</span>
                    <span className="font-semibold text-nail-purple">40,000/=</span>
                  </div>
                </div>
              </div>

              {/* Accessories & Supplies */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-nail-purple mb-4 flex items-center">
                  <div className="w-2 h-2 bg-nail-purple rounded-full mr-3"></div>
                  Accessories & Supplies
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Artificial Nails</span>
                    <span className="font-semibold text-nail-purple">150,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cutex</span>
                    <span className="font-semibold text-nail-purple">100,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Glitters</span>
                    <span className="font-semibold text-nail-purple">100,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nail Bits (Manyo)</span>
                    <span className="font-semibold text-nail-purple">100,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demi Hand</span>
                    <span className="font-semibold text-nail-purple">120,000/=</span>
                  </div>
                </div>
              </div>

              {/* Additional Items */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-nail-purple mb-4 flex items-center">
                  <div className="w-2 h-2 bg-nail-purple rounded-full mr-3"></div>
                  Additional Items
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lace</span>
                    <span className="font-semibold text-nail-purple">12,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bond</span>
                    <span className="font-semibold text-nail-purple">7,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Primer</span>
                    <span className="font-semibold text-nail-purple">20,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuticles</span>
                    <span className="font-semibold text-nail-purple">15,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remover & Cotton</span>
                    <span className="font-semibold text-nail-purple">20,000/=</span>
                  </div>
                </div>
              </div>

              {/* Personal Items */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-nail-purple mb-4 flex items-center">
                  <div className="w-2 h-2 bg-nail-purple rounded-full mr-3"></div>
                  Personal Items
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>T-shirt</span>
                    <span className="font-semibold text-nail-purple">100,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Towel (02)</span>
                    <span className="font-semibold text-nail-purple">24,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lotion (02)</span>
                    <span className="font-semibold text-nail-purple">10,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spray (02)</span>
                    <span className="font-semibold text-nail-purple">40,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brush & Enplane</span>
                    <span className="font-semibold text-nail-purple">30,000/=</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-nail-pink/10 rounded-xl p-6 border-2 border-nail-pink/20">
                <h4 className="text-xl font-semibold text-nail-purple mb-4 flex items-center">
                  <div className="w-2 h-2 bg-nail-purple rounded-full mr-3"></div>
                  Package Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total Package</span>
                    <span className="font-bold text-nail-purple">2,000,000/=</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excess Money</span>
                    <span className="font-semibold text-gray-600">15,000/=</span>
                  </div>
                  <div className="pt-3 border-t border-nail-pink/30">
                    <p className="text-sm text-gray-600">
                      All materials included in package. Complete kit provided upon enrollment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
                <Link to="/contact">Enroll Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Training Section */}
      <section className="py-16 bg-nail-pink">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Training?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-10 w-10 text-nail-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals with years of experience</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-nail-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Small Class Sizes</h3>
              <p className="text-gray-600">Maximum 8 students per class for personalized attention</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-10 w-10 text-nail-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Weekend and evening classes to fit your schedule</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-10 w-10 text-nail-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Placement</h3>
              <p className="text-gray-600">Career support and job placement assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Nail Career?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful graduates who have launched their careers in the nail industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
              <Link to="/contact">Enroll Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-nail-purple text-nail-purple hover:bg-nail-purple/10">
              <Link to="/contact">Ask Questions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full">
          {selectedVideo && (
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video 
                className="w-full h-full object-contain" 
                controls 
                autoPlay
                preload="metadata"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Video playback error:', e);
                  console.error("Unable to play this video format");
                }}
              >
                <source src={selectedVideo} type="video/mp4" />
                <source src={selectedVideo} type="video/webm" />
                <source src={selectedVideo} type="video/ogg" />
                <source src={selectedVideo} type="video/avi" />
                <source src={selectedVideo} type="video/mov" />
                <source src={selectedVideo} type="video/wmv" />
                Your browser does not support the video tag or this video format.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CourseCardProps {
  course: TrainingCourse;
  onVideoClick: (videoUrl: string) => void;
}

const CourseCard = ({ course, onVideoClick }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={course.image_url || '/placeholder.svg'} 
          alt={course.title}
          className="w-full h-full object-cover"
          style={{
            filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
            imageRendering: 'auto'
          }}
          loading="lazy"
        />
        {course.video_url && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white"
              onClick={() => onVideoClick(course.video_url!)}
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>
        )}
        {course.level && (
          <Badge className={`absolute top-4 right-4 ${getLevelColor(course.level)}`}>
            {course.level}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{course.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{course.description}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-500" />
            <span>{course.duration || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-500" />
            <span>{course.max_students || 8}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-gray-500" />
            <span>{course.instructor || 'TBD'}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-nail-purple">UGX {course.price_display || 'Contact'}</span>
          {/* <Button asChild size="sm" className="bg-nail-purple hover:bg-nail-purple/90">
            <Link to={`/training/course/${course.id}`}>
              Learn More <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

interface MediaCardProps {
  media: TrainingMedia;
  onVideoClick: (videoUrl: string) => void;
}

const MediaCard = ({ media, onVideoClick }: MediaCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-64 overflow-hidden">
        {media.type === 'image' ? (
          <img 
            src={media.url} 
            alt={media.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              style={{
                filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
                imageRendering: 'auto'
              }}
            loading="lazy"
          />
        ) : (
          <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
            <video 
              className="w-full h-full object-cover"
              poster={media.url.replace(/\.(mp4|webm|ogg|avi|mov|wmv)$/, '-poster.jpg')}
              preload="metadata"
              crossOrigin="anonymous"
              style={{
                filter: 'contrast(1.1) brightness(1.05) saturate(1.1)'
              }}
              onError={(e) => {
                console.error('Video preview error:', e);
              }}
            >
              <source src={media.url} type="video/mp4" />
              <source src={media.url} type="video/webm" />
              <source src={media.url} type="video/ogg" />
              <source src={media.url} type="video/avi" />
              <source src={media.url} type="video/mov" />
              <source src={media.url} type="video/wmv" />
            </video>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={() => onVideoClick(media.url)}
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-semibold mb-1 text-sm">{media.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{media.description}</p>
      </CardContent>
    </Card>
  );
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'Advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default Training;
