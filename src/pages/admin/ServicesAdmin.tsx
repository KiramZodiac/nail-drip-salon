import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import FileUpload from "@/components/FileUpload";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  price: number;
  is_active: boolean | null;
  image_url: string | null;
  display_order: number | null;
}

interface ServiceCategory {
  id: string;
  name: string;
  display_order: number | null;
}

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  price: number;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const ServicesAdmin = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    category: "",
    duration_minutes: 60,
    price: 0,
    image_url: "",
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      setFormData((prev) => {
        if (prev.category) return prev;
        return { ...prev, category: categories[0].name };
      });
    }
  }, [categories, formData.category]);

  const categoryOptions = useMemo(() => {
    if (!formData.category) return categories;
    const exists = categories.some((category) => category.name === formData.category);
    if (exists) return categories;
    return [
      ...categories,
      {
        id: "temporary-category",
        name: formData.category,
        display_order: null
      }
    ];
  }, [categories, formData.category]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
      if ((data?.length ?? 0) === 0) {
        setFormData((prev) => ({ ...prev, category: "" }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to fetch categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success("Service updated successfully");
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([formData]);

        if (error) throw error;
        toast.success("Service created successfully");
      }

      setIsDialogOpen(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error("Failed to save service");
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes || minutes <= 0) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours} hr${hours !== 1 ? "s" : ""}`);
    }

    if (remainingMinutes > 0) {
      parts.push(`${remainingMinutes} min`);
    }

    return parts.join(" ") || "0 min";
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      category: service.category,
      duration_minutes: service.duration_minutes || 60,
      price: service.price,
      image_url: service.image_url || "",
      display_order: service.display_order || 0,
      is_active: service.is_active || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Failed to delete service");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchServices();
    } catch (error) {
      console.error('Error toggling service status:', error);
      toast.error("Failed to update service status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: categories[0]?.name || "",
      duration_minutes: 60,
      price: 0,
      image_url: "",
      display_order: 0,
      is_active: true
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast.error("Category name is required");
      return;
    }

    try {
      setCategorySaving(true);
      const { error } = await supabase
        .from('service_categories')
        .insert([{ name: trimmedName, display_order: categories.length }]);

      if (error) throw error;

      toast.success("Category added");
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
      await fetchCategories();
      setFormData((prev) => ({ ...prev, category: trimmedName }));
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error("Failed to add category");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nail-purple mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your nail salon services</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService ? "Update the service details below." : "Fill in the details to add a new service to your salon."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Service Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter service name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={categoriesLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.length === 0 ? (
                            <SelectItem value="__no_categories" disabled>
                              No categories yet
                            </SelectItem>
                          ) : (
                            categoryOptions.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
                        Add Category
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Add a new category to re-use it for future services.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={0}
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value, 10) || 0 })}
                    placeholder="90"
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Approx. {formatDuration(formData.duration_minutes)} ({formData.duration_minutes || 0} min)
                  </p>
                </div>
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">Price (UGX) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-1"
                    required
                  />
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

              {/* Service Image */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label className="text-sm font-medium">Service Image</Label>
                <div className="space-y-4 mt-2">
                  <FileUpload
                    onUpload={(url) => setFormData({ ...formData, image_url: url })}
                    accept="image/*"
                    maxSize={5}
                    disabled={uploading}
                  />
                  <div className="text-sm text-gray-600">
                    Or enter URL manually:
                  </div>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full"
                  />
                  
                  {/* Image Preview */}
                  {formData.image_url && (
                    <div className="mt-3 border rounded-lg overflow-hidden bg-white">
                      <div className="relative">
                        <img 
                          src={formData.image_url} 
                          alt="Service image preview" 
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          Service Image
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  className="data-[state=checked]:bg-nail-purple"
                />
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Service is Active
                </Label>
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
                  {uploading ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a reusable service category. It will be available in the category list immediately.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <Label htmlFor="new_category_name" className="text-sm font-medium">
                  Category Name
                </Label>
                <Input
                  id="new_category_name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Spa Treatments"
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={categorySaving}>
                  {categorySaving ? "Saving..." : "Save Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={service.is_active || false}
                      onCheckedChange={() => handleToggleActive(service.id, service.is_active || false)}
                      className="data-[state=checked]:bg-nail-purple"
                    />
                    <span className="text-xs text-gray-500">
                      {service.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
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
                          <AlertDialogTitle>Delete Service</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{service.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(service.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{service.category}</Badge>
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="flex justify-between text-sm">
                  <span>
                    Duration: {formatDuration(service.duration_minutes)}{service.duration_minutes ? ` (${service.duration_minutes} min)` : ""}
                  </span>
                  <span className="font-semibold">{formatPrice(service.price)}</span>
                </div>
                {service.image_url && (
                  <div className="mt-2">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No services found</p>
        </div>
      )}
    </div>
  );
};

export default ServicesAdmin;
