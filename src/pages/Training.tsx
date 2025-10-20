import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users, Award, Star, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
              <Button size="lg" className="bg-nail-purple hover:bg-nail-purple/90">
                <Play className="mr-2 h-5 w-5" />
                Watch Course Preview
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => {
                  document.getElementById('training-programs')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                View All Courses
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Training Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See our students in action and explore the beautiful work created in our training programs.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveMediaCategory}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  All Media
                </TabsTrigger>
                <TabsTrigger value="student-work" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  Student Work
                </TabsTrigger>
                <TabsTrigger value="techniques" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  Techniques
                </TabsTrigger>
                <TabsTrigger value="classroom" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  Classroom
                </TabsTrigger>
                <TabsTrigger value="facility" className="data-[state=active]:bg-nail-purple data-[state=active]:text-white">
                  Facility
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeMediaCategory} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard key={item.id} media={item} onVideoClick={setSelectedVideo} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
              <Link to="/training/enroll">Enroll Now</Link>
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
                  toast.error("Unable to play this video format");
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
            imageRendering: 'high-quality'
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
          <span className="text-lg font-bold text-nail-purple">{course.price_display || 'Contact'}</span>
          <Button asChild size="sm" className="bg-nail-purple hover:bg-nail-purple/90">
            <Link to={`/training/course/${course.id}`}>
              Learn More <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
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
              imageRendering: 'high-quality'
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
