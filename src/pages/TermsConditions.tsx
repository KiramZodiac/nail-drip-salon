
import { Link } from "react-router-dom";

const TermsConditions = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last Updated: May 1, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Nail Drip Nails website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use our website or services.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
              <p className="mb-4">
                Nail Drip Nails provides nail care and beauty services. The specific services offered may change from time to time, and we reserve the right to modify or discontinue any service without notice.
              </p>
              <p>
                All services are provided subject to availability and scheduling. We recommend booking appointments in advance to ensure availability.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Appointments</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Booking</h3>
              <p className="mb-4">
                Appointments can be made online, by phone, or in person. All appointments are subject to availability.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">3.2 Cancellation Policy</h3>
              <p className="mb-4">
                We require at least 24 hours' notice for cancellations or rescheduling of appointments. Failure to provide sufficient notice may result in a cancellation fee of 50% of the scheduled service price.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">3.3 Late Arrivals</h3>
              <p className="mb-4">
                If you arrive late for an appointment, we will make every effort to accommodate you. However, your service may be abbreviated to maintain our schedule for other clients. Full service fees will apply.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">3.4 No-Shows</h3>
              <p>
                If you fail to show up for a scheduled appointment without notice, you may be charged a no-show fee equal to the full price of the scheduled service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Payment</h2>
              <p className="mb-4">
                We accept cash, credit cards, and debit cards as forms of payment. All prices are subject to change without notice. Current prices are available at our salon and on our website.
              </p>
              <p>
                Gift certificates are available for purchase and are non-refundable. They must be presented at the time of service to be redeemed.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Health and Safety</h2>
              <p className="mb-4">
                For the safety and well-being of our clients and staff, we kindly ask that you:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Inform us of any medical conditions, allergies, or medications that might affect your service</li>
                <li>Reschedule your appointment if you have any contagious conditions</li>
                <li>Follow all instructions provided by our nail technicians</li>
              </ul>
              <p>
                We reserve the right to refuse service to anyone if we believe providing services would jeopardize the health or safety of the client or our staff.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Website Use</h2>
              <p className="mb-4">
                The content on our website is for informational purposes only. We make no warranties about the accuracy, completeness, or reliability of any information on our website.
              </p>
              <p>
                You may not use our website in any way that could damage, disable, overburden, or impair our servers or networks, or interfere with any other party's use and enjoyment of the website.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p>
                All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of naildrip Nails and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, display, or create derivative works from any content without our express written permission.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, naildrip Nails shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of our services or website.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. The updated version will be indicated by an updated "Last Updated" date. Your continued use of our services after any changes indicates your acceptance of the modified Terms and Conditions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4">
                <p className="font-semibold">naildrip Nails</p>
                <p>123 Beauty Street</p>
                <p>Salon City, SC 12345</p>
                <p>Email: <a href="mailto:info@naildripnails.com" className="text-nail-purple hover:underline">info@naildripnails.com</a></p>
                <p>Phone: (123) 456-7890</p>
              </div>
            </section>
          </div>
          
          <div className="mt-12 border-t border-gray-200 pt-8">
            <Link to="/" className="text-nail-purple hover:underline font-medium">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
