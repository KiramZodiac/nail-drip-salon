import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Search, Upload, Eye, Play, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import FileUpload from "@/components/FileUpload";

interface TrainingCourse {
  id: string;
  title: string;
  description: string | null;
  category: string;
  duration: string | null;
  duration_hours: number | null;
  price_display: string | null;
  level: string | null;
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
  is_active: boolean | null;
  display_order: number | null;
}

interface TrainingMedia {
  id: string;
  type: string;
  url: string;
  title: string;
  description: string | null;
  category: string;
  course_id: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

const TrainingAdmin = () => {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [media, setMedia] = useState<TrainingMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  const [editingMedia, setEditingMedia] = useState<TrainingMedia | null>(null);
  const [uploading, setUploading] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    duration_hours: 0,
    price_display: "",
    level: "Beginner",
    max_students: 8,
    instructor: "",
    image_url: "",
    video_url: "",
    what_you_learn: [] as string[],
    prerequisites: [] as string[],
    certification: "",
    schedule: "",
    rating: 0,
    reviews_count: 0,
    is_active: true,
    display_order: 0
  });
  const [mediaFormData, setMediaFormData] = useState({
    type: "image",
    url: "",
    title: "",
    description: "",
    category: "student-work",
    course_id: null as string | null,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesResult, mediaResult] = await Promise.all([
        supabase.from('training_courses').select('*').order('display_order', { ascending: true }),
        supabase.from('training_media').select('*').order('display_order', { ascending: true })
      ]);

      if (coursesResult.error) throw coursesResult.error;
      if (mediaResult.error) throw mediaResult.error;

      setCourses(coursesResult.data || []);
      setMedia(mediaResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare data with proper null handling for optional fields
      const courseData = {
        ...courseFormData,
        description: courseFormData.description || null,
        duration: courseFormData.duration || null,
        price_display: courseFormData.price_display || null,
        level: courseFormData.level || null,
        max_students: courseFormData.max_students || null,
        instructor: courseFormData.instructor || null,
        image_url: courseFormData.image_url || null,
        video_url: courseFormData.video_url || null,
        what_you_learn: courseFormData.what_you_learn.length > 0 ? courseFormData.what_you_learn : null,
        prerequisites: courseFormData.prerequisites.length > 0 ? courseFormData.prerequisites : null,
        certification: courseFormData.certification || null,
        schedule: courseFormData.schedule || null,
        rating: courseFormData.rating || null,
        reviews_count: courseFormData.reviews_count || null,
        is_active: courseFormData.is_active,
        display_order: courseFormData.display_order || null
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('training_courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast.success("Course updated successfully");
      } else {
        const { error } = await supabase
          .from('training_courses')
          .insert([courseData]);

        if (error) throw error;
        toast.success("Course created successfully");
      }

      setIsCourseDialogOpen(false);
      setEditingCourse(null);
      resetCourseForm();
      fetchData();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error("Failed to save course");
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare data with proper null handling for course_id
      const mediaData = {
        ...mediaFormData,
        course_id: mediaFormData.course_id || null
      };

      if (editingMedia) {
        const { error } = await supabase
          .from('training_media')
          .update(mediaData)
          .eq('id', editingMedia.id);

        if (error) throw error;
        toast.success("Media updated successfully");
      } else {
        const { error } = await supabase
          .from('training_media')
          .insert([mediaData]);

        if (error) throw error;
        toast.success("Media created successfully");
      }

      setIsMediaDialogOpen(false);
      setEditingMedia(null);
      resetMediaForm();
      fetchData();
    } catch (error) {
      console.error('Error saving media:', error);
      toast.error("Failed to save media");
    }
  };

  const handleEditCourse = (course: TrainingCourse) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      description: course.description || "",
      category: course.category,
      duration: course.duration || "",
      duration_hours: course.duration_hours || 0,
      price_display: course.price_display || "",
      level: course.level || "Beginner",
      max_students: course.max_students || 8,
      instructor: course.instructor || "",
      image_url: course.image_url || "",
      video_url: course.video_url || "",
      what_you_learn: course.what_you_learn || [],
      prerequisites: course.prerequisites || [],
      certification: course.certification || "",
      schedule: course.schedule || "",
      rating: course.rating || 0,
      reviews_count: course.reviews_count || 0,
      is_active: course.is_active || false,
      display_order: course.display_order || 0
    });
    setIsCourseDialogOpen(true);
  };

  const handleEditMedia = (media: TrainingMedia) => {
    setEditingMedia(media);
    setMediaFormData({
      type: media.type,
      url: media.url,
      title: media.title,
      description: media.description || "",
      category: media.category,
      course_id: media.course_id || null,
      is_active: media.is_active || false,
      display_order: media.display_order || 0
    });
    setIsMediaDialogOpen(true);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('training_courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Course deleted successfully");
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error("Failed to delete course");
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('training_media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Media deleted successfully");
      fetchData();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error("Failed to delete media");
    }
  };

  const resetCourseForm = () => {
    setCourseFormData({
      title: "",
      description: "",
      category: "",
      duration: "",
      duration_hours: 0,
      price_display: "",
      level: "Beginner",
      max_students: 8,
      instructor: "",
      image_url: "",
      video_url: "",
      what_you_learn: [],
      prerequisites: [],
      certification: "",
      schedule: "",
      rating: 0,
      reviews_count: 0,
      is_active: true,
      display_order: 0
    });
  };

  const resetMediaForm = () => {
    setMediaFormData({
      type: "image",
      url: "",
      title: "",
      description: "",
      category: "student-work",
      course_id: null,
      is_active: true,
      display_order: 0
    });
  };

  const addLearningObjective = () => {
    setCourseFormData({
      ...courseFormData,
      what_you_learn: [...courseFormData.what_you_learn, ""]
    });
  };

  const updateLearningObjective = (index: number, value: string) => {
    const updated = [...courseFormData.what_you_learn];
    updated[index] = value;
    setCourseFormData({ ...courseFormData, what_you_learn: updated });
  };

  const removeLearningObjective = (index: number) => {
    const updated = courseFormData.what_you_learn.filter((_, i) => i !== index);
    setCourseFormData({ ...courseFormData, what_you_learn: updated });
  };

  const addPrerequisite = () => {
    setCourseFormData({
      ...courseFormData,
      prerequisites: [...courseFormData.prerequisites, ""]
    });
  };

  const updatePrerequisite = (index: number, value: string) => {
    const updated = [...courseFormData.prerequisites];
    updated[index] = value;
    setCourseFormData({ ...courseFormData, prerequisites: updated });
  };

  const removePrerequisite = (index: number) => {
    const updated = courseFormData.prerequisites.filter((_, i) => i !== index);
    setCourseFormData({ ...courseFormData, prerequisites: updated });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedia = media.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nail-purple mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading training data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
          <p className="text-gray-600">Manage training courses and media</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses and media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList>
          <TabsTrigger value="courses">Training Courses</TabsTrigger>
          <TabsTrigger value="media">Media Gallery</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Training Courses</h2>
            <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingCourse(null); resetCourseForm(); setIsCourseDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCourse ? "Update the course details below." : "Fill in the details to add a new training course."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={courseFormData.title}
                        onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={courseFormData.category}
                        onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={courseFormData.description}
                      onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (Text)</Label>
                      <Input
                        id="duration"
                        value={courseFormData.duration}
                        onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                        placeholder="e.g., 40 hours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration_hours">Duration (Hours)</Label>
                      <Input
                        id="duration_hours"
                        type="number"
                        value={courseFormData.duration_hours}
                        onChange={(e) => setCourseFormData({ ...courseFormData, duration_hours: parseInt(e.target.value) || 0 })}
                        placeholder="40"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        value={courseFormData.price_display}
                        onChange={(e) => setCourseFormData({ ...courseFormData, price_display: e.target.value })}
                        placeholder="e.g., $299"
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Level</Label>
                      <Select value={courseFormData.level} onValueChange={(value) => setCourseFormData({ ...courseFormData, level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max_students">Max Students</Label>
                      <Input
                        id="max_students"
                        type="number"
                        value={courseFormData.max_students}
                        onChange={(e) => setCourseFormData({ ...courseFormData, max_students: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor">Instructor</Label>
                      <Input
                        id="instructor"
                        value={courseFormData.instructor}
                        onChange={(e) => setCourseFormData({ ...courseFormData, instructor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Course Image</Label>
                      <div className="space-y-4">
                        <FileUpload
                          onUpload={(url) => setCourseFormData({ ...courseFormData, image_url: url })}
                          accept="image/*"
                          maxSize={5}
                          disabled={uploading}
                        />
                        <div className="text-sm text-gray-500">
                          Or enter URL manually:
                        </div>
                        <Input
                          id="image_url"
                          value={courseFormData.image_url}
                          onChange={(e) => setCourseFormData({ ...courseFormData, image_url: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Course Video</Label>
                      <div className="space-y-4">
                        <FileUpload
                          onUpload={(url) => setCourseFormData({ ...courseFormData, video_url: url })}
                          accept="video/*"
                          maxSize={50}
                          disabled={uploading}
                        />
                        <div className="text-sm text-gray-500">
                          Or enter URL manually:
                        </div>
                        <Input
                          id="video_url"
                          value={courseFormData.video_url}
                          onChange={(e) => setCourseFormData({ ...courseFormData, video_url: e.target.value })}
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>What You'll Learn</Label>
                    <div className="space-y-2">
                      {courseFormData.what_you_learn.map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            value={item}
                            onChange={(e) => updateLearningObjective(index, e.target.value)}
                            placeholder="Learning objective"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLearningObjective(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addLearningObjective}>
                        Add Learning Objective
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Prerequisites</Label>
                    <div className="space-y-2">
                      {courseFormData.prerequisites.map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            value={item}
                            onChange={(e) => updatePrerequisite(index, e.target.value)}
                            placeholder="Prerequisite"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePrerequisite(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addPrerequisite}>
                        Add Prerequisite
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="certification">Certification</Label>
                      <Input
                        id="certification"
                        value={courseFormData.certification}
                        onChange={(e) => setCourseFormData({ ...courseFormData, certification: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="schedule">Schedule</Label>
                      <Input
                        id="schedule"
                        value={courseFormData.schedule}
                        onChange={(e) => setCourseFormData({ ...courseFormData, schedule: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={courseFormData.is_active}
                      onChange={(e) => setCourseFormData({ ...courseFormData, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCourseDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCourse ? "Update" : "Create"} Course
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                      <Badge variant={course.is_active ? "default" : "secondary"}>
                        {course.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>{course.duration}</span>
                      <span className="font-semibold">{course.price_display}</span>
                    </div>
                    {course.image_url && (
                      <div className="mt-2">
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Training Media</h2>
            <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingMedia(null); resetMediaForm(); setIsMediaDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Media
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingMedia ? "Edit Media" : "Add New Media"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMedia ? "Update the media details below." : "Add new media to your training gallery."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleMediaSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="media_type">Type</Label>
                      <Select value={mediaFormData.type} onValueChange={(value) => setMediaFormData({ ...mediaFormData, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="media_category">Category</Label>
                      <Select value={mediaFormData.category} onValueChange={(value) => setMediaFormData({ ...mediaFormData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student-work">Student Work</SelectItem>
                          <SelectItem value="classroom">Classroom</SelectItem>
                          <SelectItem value="techniques">Techniques</SelectItem>
                          <SelectItem value="instructors">Instructors</SelectItem>
                          <SelectItem value="facility">Facility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="media_title">Title</Label>
                    <Input
                      id="media_title"
                      value={mediaFormData.title}
                      onChange={(e) => setMediaFormData({ ...mediaFormData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="media_description">Description</Label>
                    <Textarea
                      id="media_description"
                      value={mediaFormData.description}
                      onChange={(e) => setMediaFormData({ ...mediaFormData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Media File</Label>
                    <div className="space-y-4">
                      <FileUpload
                        onUpload={(url) => setMediaFormData({ ...mediaFormData, url })}
                        accept={mediaFormData.type === 'image' ? 'image/*' : 'video/*'}
                        maxSize={mediaFormData.type === 'image' ? 5 : 50}
                        disabled={uploading}
                      />
                      <div className="text-sm text-gray-500">
                        Or enter URL manually:
                      </div>
                      <Input
                        id="media_url"
                        value={mediaFormData.url}
                        onChange={(e) => setMediaFormData({ ...mediaFormData, url: e.target.value })}
                        placeholder="https://example.com/file.jpg"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="media_is_active"
                      checked={mediaFormData.is_active}
                      onChange={(e) => setMediaFormData({ ...mediaFormData, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="media_is_active">Active</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsMediaDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingMedia ? "Update" : "Create"} Media
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMedia(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Media</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteMedia(item.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="mt-2">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingAdmin;