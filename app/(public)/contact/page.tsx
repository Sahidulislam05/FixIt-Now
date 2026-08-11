import { ContactForm } from "@/components/forms/contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | FixitNow",
  description: "Get in touch with FixitNow support team for inquiries and assistance.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Get in Touch
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Have questions or need assistance with your booking? Our dedicated team is here to help you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-8 p-8 border rounded-2xl bg-card shadow-sm">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Headquarters</h4>
                <p className="text-sm text-muted-foreground">
                  Level 5, Tech Hub Tower, Gulshan-2, Dhaka 1212, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Phone Support</h4>
                <p className="text-sm text-muted-foreground">+880 1700-000000</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Email Us</h4>
                <p className="text-sm text-muted-foreground">support@fixitnow.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Working Hours</h4>
                <p className="text-sm text-muted-foreground">Monday – Sunday: 8:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 border rounded-2xl bg-card shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}