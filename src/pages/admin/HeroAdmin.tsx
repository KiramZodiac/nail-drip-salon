import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Play,
  Pause
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import FileUpload from "@/components/FileUpload";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  button_text: string | null;
  button_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Valid site routes that can be used for hero button URLs
const VALID_ROUTES = [
  { value: "none", label: "No Button" },
  { value: "/", label: "Home" },
  { value: "/services", label: "Services" },
  { value: "/training", label: "Training" },
  { value: "/gallery", label: "Gallery" },
  { value: "/about", label: "About" },
  { value: "/contact", label: "Contact" },
  { value: "/booking", label: "Booking" },
  { value: "/privacy-policy", label: "Privacy Policy" },
  { value: "/terms-conditions", label: "Terms & Conditions" }
];

const HeroAdmin = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    button_text: "",
    button_url: "",
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      toast.error("Failed to fetch hero slides");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that if button_url is provided, button_text must also be provided
    if (formData.button_url && formData.button_url !== "none" && !formData.button_text.trim()) {
      toast.error("Button text is required when a button URL is selected");
      return;
    }
    
    // If no button URL is selected, clear button text and URL
    const submitData = {
      ...formData,
      button_text: formData.button_url && formData.button_url !== "none" ? formData.button_text : "",
      button_url: formData.button_url && formData.button_url !== "none" ? formData.button_url : ""
    };
    
    try {
      if (editingSlide) {
        // Update existing slide
        const { error } = await supabase
          .from('hero_slides')
          .update(submitData)
          .eq('id', editingSlide.id);

        if (error) throw error;
        toast.success("Hero slide updated successfully");
      } else {
        // Create new slide
        const { error } = await supabase
          .from('hero_slides')
          .insert([submitData]);

        if (error) throw error;
        toast.success("Hero slide created successfully");
      }

      setIsDialogOpen(false);
      setEditingSlide(null);
      resetForm();
      fetchSlides();
    } catch (error) {
      console.error('Error saving hero slide:', error);
      toast.error("Failed to save hero slide");
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      image_url: slide.image_url,
      button_text: slide.button_text || "",
      button_url: slide.button_url || "none",
      display_order: slide.display_order,
      is_active: slide.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Hero slide deleted successfully");
      fetchSlides();
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      toast.error("Failed to delete hero slide");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Hero slide ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchSlides();
    } catch (error) {
      console.error('Error toggling hero slide:', error);
      toast.error("Failed to update hero slide");
    }
  };

  const handleMoveSlide = async (id: string, direction: 'up' | 'down') => {
    try {
      const slide = slides.find(s => s.id === id);
      if (!slide) return;

      const newOrder = direction === 'up' 
        ? slide.display_order - 1 
        : slide.display_order + 1;

      // Find the slide that will be swapped
      const targetSlide = slides.find(s => s.display_order === newOrder);
      if (!targetSlide) return;

      // Swap the display orders
      await supabase
        .from('hero_slides')
        .update({ display_order: newOrder })
        .eq('id', id);

      await supabase
        .from('hero_slides')
        .update({ display_order: slide.display_order })
        .eq('id', targetSlide.id);

      toast.success("Slide order updated successfully");
      fetchSlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      toast.error("Failed to move slide");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      button_text: "",
      button_url: "none",
      display_order: slides.length,
      is_active: true
    });
  };

  const handleAddNew = () => {
    setEditingSlide(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (slide.subtitle && slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nail-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600">Manage your homepage hero section slides</p>
        </div>
        <Button onClick={handleAddNew} className="bg-nail-purple hover:bg-nail-purple/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search slides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlides.map((slide, index) => (
          <Card key={slide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={slide.image_url} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Badge variant={slide.is_active ? "default" : "secondary"}>
                  {slide.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">
                  Order: {slide.display_order}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">{slide.title}</h3>
                {slide.subtitle && (
                  <p className="text-sm text-gray-600 line-clamp-1">{slide.subtitle}</p>
                )}
                {slide.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{slide.description}</p>
                )}
                {slide.button_text && (
                  <p className="text-xs text-nail-purple font-medium">Button: {slide.button_text}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(slide)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(slide.id, slide.is_active)}
                  >
                    {slide.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{slide.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(slide.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveSlide(slide.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveSlide(slide.id, 'down')}
                    disabled={index === slides.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSlides.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hero slides found</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Edit Hero Slide" : "Add New Hero Slide"}
            </DialogTitle>
            <DialogDescription>
              {editingSlide ? "Update the hero slide details below." : "Create a new hero slide for your homepage."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Main headline"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Optional subtitle"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service or promotion"
                rows={3}
              />
            </div>

            <div>
              <Label>Hero Image *</Label>
              <div className="space-y-4">
                <FileUpload
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                  accept="image/*"
                  maxSize={10}
                  disabled={uploading}
                />
                <div className="text-sm text-gray-500">
                  Or enter URL manually:
                </div>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/hero-image.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="button_text">
                  Button Text {formData.button_url && formData.button_url !== "none" && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Call to Action"
                  className={formData.button_url && formData.button_url !== "none" && !formData.button_text.trim() ? "border-red-500" : ""}
                />
                {formData.button_url && formData.button_url !== "none" && !formData.button_text.trim() && (
                  <p className="text-sm text-red-500 mt-1">Button text is required when a URL is selected</p>
                )}
              </div>
              <div>
                <Label htmlFor="button_url">Button URL</Label>
                <Select
                  value={formData.button_url}
                  onValueChange={(value) => setFormData({ ...formData, button_url: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page to link to" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_ROUTES.map((route) => (
                      <SelectItem key={route.value} value={route.value}>
                        {route.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-nail-purple hover:bg-nail-purple/90">
                {editingSlide ? "Update Slide" : "Create Slide"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroAdmin;
