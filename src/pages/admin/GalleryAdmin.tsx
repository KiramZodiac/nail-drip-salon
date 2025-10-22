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
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Star, Play, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import FileUpload from "@/components/FileUpload";

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

const GalleryAdmin = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    video_url: "",
    media_type: "image",
    category: "",
    tags: [] as string[],
    is_featured: false,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error("Failed to fetch gallery images");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingImage) {
        const { error } = await supabase
          .from('gallery')
          .update(formData)
          .eq('id', editingImage.id);

        if (error) throw error;
        toast.success("Image updated successfully");
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([formData]);

        if (error) throw error;
        toast.success("Image added successfully");
      }

      setIsDialogOpen(false);
      setEditingImage(null);
      resetForm();
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error("Failed to save image");
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      video_url: image.video_url || "",
      media_type: image.media_type || "image",
      category: image.category || "",
      tags: image.tags || [],
      is_featured: image.is_featured || false,
      is_active: image.is_active !== null ? image.is_active : true,
      display_order: image.display_order || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Image ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchImages();
    } catch (error) {
      console.error('Error toggling image status:', error);
      toast.error("Failed to update image status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      video_url: "",
      media_type: "image",
      category: "",
      tags: [],
      is_featured: false,
      is_active: true,
      display_order: 0
    });
  };

  const handleAddNew = () => {
    setEditingImage(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, ""]
    });
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...formData.tags];
    updated[index] = value;
    setFormData({ ...formData, tags: updated });
  };

  const removeTag = (index: number) => {
    const updated = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: updated });
  };

  const filteredImages = images.filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.category && image.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (image.tags && image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nail-purple mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your nail art gallery</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Edit Media" : "Add New Media"}
              </DialogTitle>
              <DialogDescription>
                {editingImage ? "Update the media details below." : "Add a new image or video to your gallery."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Media Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter media title"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="media_type" className="text-sm font-medium">Media Type *</Label>
                  <Select value={formData.media_type} onValueChange={(value) => setFormData({ ...formData, media_type: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter media description"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Media Upload Section */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label className="text-sm font-medium">
                  {formData.media_type === 'video' ? 'Video File *' : 'Image File *'}
                </Label>
                <div className="space-y-4 mt-2">
                  <FileUpload
                    onUpload={(url) => {
                      if (formData.media_type === 'video') {
                        setFormData({ ...formData, video_url: url });
                      } else {
                        setFormData({ ...formData, image_url: url });
                      }
                    }}
                    accept={formData.media_type === 'video' ? "video/*" : "image/*"}
                    maxSize={formData.media_type === 'video' ? 50 : 5}
                    disabled={uploading}
                  />
                  <div className="text-sm text-gray-600">
                    Or enter URL manually:
                  </div>
                  <Input
                    id={formData.media_type === 'video' ? 'video_url' : 'image_url'}
                    value={formData.media_type === 'video' ? formData.video_url : formData.image_url}
                    onChange={(e) => {
                      if (formData.media_type === 'video') {
                        setFormData({ ...formData, video_url: e.target.value });
                      } else {
                        setFormData({ ...formData, image_url: e.target.value });
                      }
                    }}
                    placeholder={formData.media_type === 'video' ? "https://example.com/video.mp4" : "https://example.com/image.jpg"}
                    className="w-full"
                    required
                  />
                  
                  {/* Media Preview */}
                  {(formData.media_type === 'video' ? formData.video_url : formData.image_url) && (
                    <div className="mt-3 border rounded-lg overflow-hidden bg-white">
                      {formData.media_type === 'video' ? (
                        <div className="relative">
                          <video 
                            src={formData.video_url} 
                            className="w-full h-32 object-cover"
                            controls
                            preload="metadata"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            Video Preview
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            src={formData.image_url} 
                            alt="Image preview" 
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            Image Preview
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {formData.media_type === 'video' && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <Label className="text-sm font-medium">Video Thumbnail (Optional)</Label>
                  <div className="space-y-4 mt-2">
                    <FileUpload
                      onUpload={(url) => setFormData({ ...formData, image_url: url })}
                      accept="image/*"
                      maxSize={5}
                      disabled={uploading}
                    />
                    <div className="text-sm text-gray-600">
                      Or enter thumbnail URL manually:
                    </div>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="w-full"
                    />
                    
                    {/* Thumbnail Preview */}
                    {formData.image_url && (
                      <div className="mt-3 border rounded-lg overflow-hidden bg-white">
                        <div className="relative">
                          <img 
                            src={formData.image_url} 
                            alt="Thumbnail preview" 
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            Thumbnail
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category and Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manicures">Manicures</SelectItem>
                      <SelectItem value="Pedicures">Pedicures</SelectItem>
                      <SelectItem value="Extensions">Extensions</SelectItem>
                      <SelectItem value="Nail Art">Nail Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order" className="text-sm font-medium">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="space-y-3 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder="Enter tag name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTag(index)}
                        className="px-3"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTag}
                    className="w-full"
                  >
                    + Add Tag
                  </Button>
                </div>
              </div>

              {/* Featured and Active Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_featured" className="text-sm font-medium">
                    Featured Media
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_active" className="text-sm font-medium">
                    Visible to Users
                  </Label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 sm:flex-none bg-nail-purple hover:bg-nail-purple/90"
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : editingImage ? "Update Media" : "Add Media"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{image.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(image.id, image.is_active || false)}
                    title={image.is_active ? "Hide from users" : "Show to users"}
                    className={image.is_active ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                  >
                    {image.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(image)}
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
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{image.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(image.id)}>
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
                  {image.category && (
                    <Badge variant="outline">{image.category}</Badge>
                  )}
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    image.media_type === 'video' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {image.media_type === 'video' ? (
                      <Play className="h-3 w-3" />
                    ) : (
                      <ImageIcon className="h-3 w-3" />
                    )}
                    <span>{image.media_type === 'video' ? 'Video' : 'Image'}</span>
                  </div>
                  {image.is_featured && (
                    <Badge variant="default" className="bg-yellow-500">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant={image.is_active ? "default" : "secondary"} className={image.is_active ? "bg-green-500" : "bg-gray-400"}>
                    {image.is_active ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" />
                        Hidden
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{image.description}</p>
                <div className="mt-2 relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  {image.media_type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded">
                      <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-nail-purple ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images found</p>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
