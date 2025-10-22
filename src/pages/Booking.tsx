
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  service: z.string().min(1, { message: "Please select a service" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  notes: z.string().optional(),
});

const Booking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

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

  // Get preselected service from URL parameters
  const preselectedServiceId = searchParams.get('serviceId');
  const preselectedService = services.find(service => service.id === preselectedServiceId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      service: preselectedServiceId || "",
      notes: "",
    },
  });

  // Watch the form's service field to get the currently selected service
  const selectedServiceId = form.watch('service');
  const selectedService = services.find(service => service.id === selectedServiceId);

  // Update form when preselected service changes
  useEffect(() => {
    if (preselectedServiceId) {
      form.setValue('service', preselectedServiceId);
    }
  }, [preselectedServiceId, form]);
  
  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Get the selected service details
      const selectedService = services.find(service => service.id === formData.service);
      
      // Format the date
      const formattedDate = format(formData.date, "EEEE, MMMM do, yyyy");
      
      // Create WhatsApp message
      const whatsappMessage = `Hello! I would like to book an appointment:

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
💅 *Service:* ${selectedService?.name} - $${selectedService?.price}
📅 *Date:* ${formattedDate}
🕐 *Time:* ${formData.time}
${formData.notes ? `📝 *Notes:* ${formData.notes}` : ''}

Please confirm my appointment. Thank you!`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/256758907256?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab/window
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      toast.success('Opening WhatsApp...', {
        description: "Your booking details have been prepared. Please send the message to confirm your appointment."
      });
      
      // Reset the form
      form.reset();
      
    } catch (error) {
      console.error('Error preparing WhatsApp message:', error);
      toast.error('Failed to prepare booking message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Service options will be generated from database

  const timeOptions = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
    "7:00 PM", "7:30 PM",
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-nail-lavender py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book an Appointment</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Schedule your visit to Nail Drip and treat yourself to a luxurious nail experience.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Book via WhatsApp</h2>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below and we'll open WhatsApp with your booking details ready to send. 
                    Simply tap send to confirm your appointment!
                  </p>
                  
                  {selectedService && (
                    <div className="mb-6 p-4 bg-nail-pink/20 border border-nail-purple/20 rounded-lg">
                      <h3 className="font-semibold text-nail-purple mb-2">Selected Service</h3>
                      <p className="text-gray-700">
                        <strong>{selectedService.name}</strong> - ${selectedService.price}
                        {selectedService.description && (
                          <span className="block text-sm text-gray-600 mt-1">
                            {selectedService.description}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Duration: {selectedService.duration_minutes < 60 
                          ? `${selectedService.duration_minutes} minutes` 
                          : `${Math.floor(selectedService.duration_minutes / 60)}h ${selectedService.duration_minutes % 60}m`
                        }
                      </p>
                    </div>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Service</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {loading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading services...
                                  </SelectItem>
                                ) : (
                                  services.map((service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                      {service.name} - ${service.price}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Appointment Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Select date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => {
                                      // Disable dates in the past and Sundays if needed
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return date < today;
                                    }}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Appointment Time</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any special requests or information we should know"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="w-full bg-nail-purple hover:bg-nail-purple/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Preparing..." : "Book via WhatsApp"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-nail-purple" />
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Booking Information</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Please arrive 5-10 minutes before your appointment time.</li>
                      <li>Cancellations must be made at least 24 hours in advance.</li>
                      <li>Late arrivals may result in shortened service time.</li>
                      <li>A credit card is required to hold appointments for new clients.</li>
                      <li>For group bookings of 3 or more, please call us directly.</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                    <p className="text-gray-700 mb-2">
                      If you prefer to book by phone or have any questions:
                    </p>
                    <p className="font-medium">
                      <a href="tel:+256758907256" className="text-nail-purple hover:underline">
                        +256 758 907256
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Service interface
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

export default Booking;
