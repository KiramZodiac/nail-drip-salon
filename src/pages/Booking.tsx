
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
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
  
  // Use preselected service if available, otherwise use the currently selected service
  const displayService = preselectedService || selectedService;

  // Update form when preselected service changes
  useEffect(() => {
    if (preselectedServiceId) {
      form.setValue('service', preselectedServiceId);
    }
  }, [preselectedServiceId, form]);
  
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const selectedService = services.find(
        (service) => service.id === formData.service
      );

      // Prepare WhatsApp message BEFORE async operation to avoid popup blocker
      const formattedDate = format(formData.date, "EEEE, MMMM do, yyyy");
      const formattedPrice = selectedService
        ? formatPrice(selectedService.price)
        : "N/A";

      const whatsappMessage = `Hello! I would like to book an appointment:

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
💅 *Service:* ${selectedService?.name || "Custom"} - ${formattedPrice}
📅 *Date:* ${formattedDate}
🕐 *Time:* ${formData.time}
${formData.notes ? `📝 *Notes:* ${formData.notes}` : ""}

Please confirm my appointment. Thank you!`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/256758907256?text=${encodedMessage}`;

      // Open WhatsApp window immediately (before async operation) to avoid popup blocker
      const whatsappWindow = window.open(whatsappUrl, "_blank");

      const payload = {
        name: formData.name,
        phone: formData.phone,
        service_id: selectedService?.id ?? null,
        service_name: selectedService?.name ?? null,
        service_price: selectedService?.price ?? null,
        appointment_date: formData.date.toISOString(),
        appointment_time: formData.time,
        notes: formData.notes?.trim() ? formData.notes.trim() : null,
        status: "pending",
        source: "website",
      };

      const { error: bookingError } = await supabase
        .from("bookings")
        .insert([payload]);

      if (bookingError) {
        throw bookingError;
      }

      // If popup was blocked, show a message
      if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
        toast.warning("Popup blocked", {
          description: "Please allow popups for this site, or click here to open WhatsApp manually.",
          action: {
            label: "Open WhatsApp",
            onClick: () => window.open(whatsappUrl, "_blank"),
          },
        });
      }

      toast.success("Booking request stored", {
        description:
          "We saved the appointment details and prepared your WhatsApp confirmation.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting booking request:", error);
      toast.error("Failed to save your booking. Please try again.");
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
      <section className="py-32 relative overflow-hidden">
        {/* Background Image */}
        <AnimatePresence mode="wait">
          {displayService && displayService.image_url ? (
            <motion.div 
              key={displayService.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${displayService.image_url})`,
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
            </motion.div>
          ) : (
            <motion.div 
              key="default-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/bg.jpeg')`,
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <AnimatePresence mode="wait">
              {displayService ? (
                <motion.div
                  key={`service-${displayService.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                    Book {displayService.name}
                  </h1>
                  <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
                    {displayService.description || 'Schedule your visit to Nail Drip and treat yourself to a luxurious nail experience.'}
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 inline-flex items-center space-x-4 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30"
                  >
                    <span className="text-white font-semibold">{formatPrice(displayService.price)}</span>
                    <span className="text-white/80 text-sm">
                      {displayService.duration_minutes < 60 
                        ? `${displayService.duration_minutes} minutes` 
                        : `${Math.floor(displayService.duration_minutes / 60)}h ${displayService.duration_minutes % 60}m`
                      }
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Book an Appointment</h1>
                  <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
                    Schedule your visit to Nail Drip and treat yourself to a luxurious nail experience.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
                  <h2 className="text-2xl font-bold mb-6">Book Your Appointment</h2>
                  <p className="text-gray-600 mb-6">
                    Complete the form below to schedule your visit. We'll prepare your appointment details and 
                    connect you with our team to confirm your booking.
                  </p>
                  
                  {displayService && (
                    <div className="mb-6 p-4 bg-nail-pink/20 border border-nail-purple/20 rounded-lg">
                      <h3 className="font-semibold text-nail-purple mb-2">Selected Service</h3>
                      <p className="text-gray-700">
                        <strong>{displayService.name}</strong> - {formatPrice(displayService.price)}
                        {displayService.description && (
                          <span className="block text-sm text-gray-600 mt-1">
                            {displayService.description}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Duration: {displayService.duration_minutes < 60 
                          ? `${displayService.duration_minutes} minutes` 
                          : `${Math.floor(displayService.duration_minutes / 60)}h ${displayService.duration_minutes % 60}m`
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
                                      {service.name} - {formatPrice(service.price)}
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
                          {isSubmitting ? "Processing..." : "Book Appointment"}
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
                      <span>9:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>10:00 AM - 11:00 PM</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Booking Information</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Please arrive 5-10 minutes before your appointment time.</li>
                      <li>Cancellations must be made at least 24 hours in advance.</li>
                      <li>Late arrivals may result in shortened service time.</li>
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
