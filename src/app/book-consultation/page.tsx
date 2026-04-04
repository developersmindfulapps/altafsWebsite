import type { Metadata } from "next";
import { CheckCircle2, ChevronDown, Calendar, Clock } from "lucide-react";
import Button from "@/components/Button";
import { getWebsiteContent } from "@/lib/getContent";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Schedule a confidential legal consultation with Sheikh Altaf Hussain. Expert legal guidance in Jammu District Court and High Court.",
};

export default async function BookConsultationPage({
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
      <section className="bg-primary text-white pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-light tracking-wider text-xs font-semibold uppercase mb-6">
            Secure Your Future
          </span>
          <h1 className="mb-4">Schedule a Consultation</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Take the first step toward resolving your legal matter. Share the details of your situation below to request a confidential case evaluation.
          </p>
        </div>
      </section>

      {isSuccess && (
        <div className="bg-green-50 border-b border-green-200 py-4">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl text-green-800 font-medium text-center">
            Your consultation request has been successfully submitted. Our team will contact you shortly to confirm your appointment.
          </div>
        </div>
      )}

      {hasError && (
        <div className="bg-red-50 border-b border-red-200 py-4">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl text-red-800 font-medium text-center">
            There was an error submitting your request. Please try again or call our office directly.
          </div>
        </div>
      )}

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Consultation Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-8 md:p-12 border border-slate-100 shadow-xl rounded-sm">
                <h3 className="mb-8 font-semibold pb-4 border-b border-slate-100">Consultation Request</h3>
                
                <form className="space-y-6" action="/api/consultation" method="POST">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name *</label>
                      <input type="text" id="name" name="name" required className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address *</label>
                      <input type="email" id="email" name="email" required className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number *</label>
                      <input type="tel" id="phone" name="phone" required className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="caseType" className="block text-sm font-medium text-slate-700">Case Type *</label>
                      <div className="relative">
                        <select id="caseType" name="caseType" required className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none bg-white">
                          <option value="">Select case type...</option>
                          {content.homepage.practiceAreas.map((area, index) => (
                            <option key={index} value={area.title}>{area.title}</option>
                          ))}
                          <option value="other">Other / Not Sure</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Scheduling Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label htmlFor="date" className="block text-sm font-medium text-slate-700">Preferred Date</label>
                      <div className="relative">
                        <input type="date" id="date" name="date" className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none" />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none hidden" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="timeSlot" className="block text-sm font-medium text-slate-700">Preferred Time Slot</label>
                      <div className="relative">
                        <select id="timeSlot" name="timeSlot" className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none bg-white">
                          <option value="">Select time slot...</option>
                          {content.bookingPage.timeSlots.map((slot, idx) => (
                            <option key={idx} value={slot}>{slot}</option>
                          ))}
                        </select>
                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">Brief Description of Your Situation</label>
                    <textarea id="message" name="message" rows={4} className="w-full border border-slate-300 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y" placeholder="Please provide general details. Avoid sharing highly sensitive information until an attorney-client relationship is established."></textarea>
                  </div>

                  <div className="flex items-start gap-3 mt-6 p-4 bg-slate-100/50 rounded-sm">
                    <input type="checkbox" id="disclaimer" name="disclaimer" required className="mt-1 shrink-0 accent-primary" />
                    <label htmlFor="disclaimer" className="text-xs text-slate-600 leading-relaxed">
                      <strong>Disclaimer:</strong> I understand that submitting this form does not establish an attorney-client relationship. Information provided on this form is not privileged until a formal agreement is signed.
                    </label>
                  </div>

                  <Button type="submit" className="w-full mt-8">
                    Submit Request
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="w-full lg:w-1/3 space-y-10">
              {/* FAQ mapping */}
              {content.bookingPage.faq.length > 0 && (
                <div>
                  <h3 className="mb-6 font-semibold">Frequently Asked Questions</h3>
                  <div className="space-y-6">
                    {content.bookingPage.faq.map((faq, idx) => (
                      <div key={idx} className="bg-white p-6 border border-slate-100 rounded-sm shadow-sm">
                        <h4 className="font-semibold text-primary mb-2 flex gap-2"><CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />{faq.question}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
