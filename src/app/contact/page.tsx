import type { Metadata } from "next";
import { Mail, MapPin, Phone, AlertCircle } from "lucide-react";
import Button from "@/components/Button";
import { getWebsiteContent } from "@/lib/getContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sheikh Altaf Hussain Law Firm in Jammu. Schedule a consultation or reach out for legal representation.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const isSuccess = params.success === 'true';
  const hasError = params.error !== undefined;
  const content = await getWebsiteContent();

  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h1 className="mb-4">Contact Our Office</h1>
          <p className="text-white/80 text-lg max-w-2xl font-light">
            We are here to help. Reach out to schedule a consultation or discuss your legal needs with our experienced team.
          </p>
        </div>
      </section>

      {isSuccess && (
        <div className="bg-green-50 border-b border-green-200 py-4">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl text-green-800 font-medium text-center">
            Your message has been successfully sent. We will contact you shortly.
          </div>
        </div>
      )}

      {hasError && (
        <div className="bg-red-50 border-b border-red-200 py-4">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl text-red-800 font-medium text-center">
            There was an error submitting your message. Please try again.
          </div>
        </div>
      )}

      {/* Emergency Banner */}
      <div className="bg-secondary text-primary py-4">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-sm">Facing an immediate legal crisis or arrest?</span>
          </div>
          <a href={`tel:${(content.contactPage.emergencyPhone || "").replace(/[^0-9+]/g, '')}`} className="font-bold text-lg hover:underline whitespace-nowrap">
            24/7 Emergency Line: {content.contactPage.emergencyPhone}
          </a>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Contact Info & Map */}
            <div className="w-full lg:w-1/3 space-y-10">
              <div>
                <h3 className="mb-6 font-semibold">Contact Information</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-1">Office Address</h4>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {content.siteSettings.address}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-1">Phone</h4>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">
                        {content.siteSettings.phone}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-1">Email</h4>
                      <p className="text-slate-600 text-sm">
                        {content.siteSettings.email}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map Placeholder */}
              <div className="bg-slate-100 w-full h-64 rounded-sm flex items-center justify-center border border-slate-200 shadow-inner">
                <div className="text-center text-slate-400 p-4">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <span className="text-sm font-medium uppercase tracking-wider">Interactive Map Placeholder</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-slate-50 p-8 md:p-12 border border-slate-100 shadow-sm rounded-sm">
                <h3 className="mb-2 font-semibold">Send Us a Message</h3>
                <p className="text-slate-500 text-sm mb-8">
                  Fill out the form below and our team will get back to you within 24 hours. Please do not include sensitive information.
                </p>

                <form className="space-y-6" action="/api/contact" method="POST">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="practiceArea" className="block text-sm font-medium text-slate-700">Practice Area</label>
                    <div className="relative">
                      <select 
                        id="practiceArea" 
                        name="practiceArea" 
                        className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none bg-white"
                      >
                        <option value="">Select a practice area...</option>
                        {content.homepage.practiceAreas.map((area, index) => (
                          <option key={index} value={area.title}>{area.title}</option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      required 
                      className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-y"
                      placeholder="Briefly describe your legal issue..."
                    ></textarea>
                  </div>

                  <Button type="submit" className="w-full md:w-auto px-10">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
