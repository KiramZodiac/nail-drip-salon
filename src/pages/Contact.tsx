

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/sonner";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            status: 'new'
          }
        ]);

      if (error) {
        console.error('Error saving message:', error);
        toast.error("Failed to send message. Please try again.");
        return;
      }

      // Create WhatsApp message
      const whatsappMessage = `Hello! I have a message for you:

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📞 *Phone:* ${data.phone}
📝 *Subject:* ${data.subject}

💬 *Message:*
${data.message}

Please get back to me soon. Thank you!`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/256751214095?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab/window
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      toast.success("Message sent successfully!", {
        description: "Your message has been saved and WhatsApp is opening for you to send it directly."
      });
      
      // Reset the form
      form.reset();
      
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-nail-pink py-28">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Have questions or want to book an appointment? Get in touch with us and we'll be happy to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-nail-lavender w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-nail-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600">
                  Nail Drip Salon<br />
                  Kampala, Uganda<br />
                  East Africa
                </p>
                <a 
                  href="https://www.google.com/maps/place/Nail+Drip+salon/@0.2770599,32.5653045,17z/data=!3m1!4b1!4m6!3m5!1s0x177dbdbc76de9fe7:0xcd24f38a09bd0a6f!8m2!3d0.2770599!4d32.5653045!16s%2Fg%2F11rkg4p3wm?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nail-purple mt-4 hover:underline"
                >
                  Get Directions
                </a>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-nail-lavender w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-nail-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">Phone: (123) 456-7890</p>
                <p className="text-gray-600">WhatsApp: (123) 456-7890</p>
                <a 
                  href="tel:+1234567890" 
                  className="text-nail-purple mt-4 hover:underline"
                >
                  Call Now
                </a>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-nail-lavender w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-nail-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">General: info@nagaayinails.com</p>
                <p className="text-gray-600">Bookings: bookings@nagaayinails.com</p>
                <a 
                  href="mailto:info@nagaayinails.com" 
                  className="text-nail-purple mt-4 hover:underline"
                >
                  Send Email
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="bg-nail-lavender w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                    <Clock className="h-8 w-8 text-nail-purple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Monday - Friday</p>
                        <p className="text-gray-600">9:00 AM - 8:00 PM</p>
                      </div>
                      <div>
                        <p className="font-medium">Saturday</p>
                        <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                      </div>
                      <div>
                        <p className="font-medium">Sunday</p>
                        <p className="text-gray-600">10:00 AM - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <div className="w-24 h-1 bg-nail-purple mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Have a question or want to book an appointment? Fill out the form below and we'll save your message and open WhatsApp for you to send it directly.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject of your message" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message" 
                              rows={5} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-right">
                      <Button 
                        type="submit" 
                        className="bg-nail-purple hover:bg-nail-purple/90 w-full md:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message & WhatsApp"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="relative h-[500px] w-full overflow-hidden">
          <iframe 
            title="Nail Drip Salon Location"
            className="w-full h-full border-0"
            src="https://maps.google.com/maps?q=0.2770599,32.5653045&hl=en&z=17&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
              transform: 'scale(1.02)',
              transformOrigin: 'center'
            }}
          ></iframe>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>
      </section>
    </div>
  );
};

export default Contact;