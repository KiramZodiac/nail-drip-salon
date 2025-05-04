
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-nail-pink py-20">
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
                  123 Beauty Street<br />
                  Salon City, SC 12345<br />
                  United States
                </p>
                <a 
                  href="https://maps.google.com" 
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
              Have a question or want to book an appointment? Fill out the form below and we'll get back to you as soon as possible.
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
                        {isSubmitting ? "Sending..." : "Send Message"}
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
        <div className="h-96 w-full">
          <iframe 
            title="Nagaayi Nails Location"
            className="w-full h-full border-0"
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3989.7552257428842!2d32.55391117572888!3d0.32222389204520135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sNakulabye%20round!5e0!3m2!1sen!2sug!4v1746215095425!5m2!1sen!2sug"

            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;