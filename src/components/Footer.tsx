import Link from "next/link";
import { Mail, MapPin, Phone, Scale } from "lucide-react";
import { getWebsiteContent } from "@/lib/getContent";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const content = await getWebsiteContent();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 text-white group">
              <Scale className="h-8 w-8 text-secondary" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-none tracking-tight uppercase">
                  {content.siteSettings.siteName}
                </span>
                <span className="text-xs uppercase tracking-widest mt-1 text-white/80">
                  {(content.footer.brandTagline || "").trim() || "Advocates & Legal Consultants"}
                </span>
              </div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {content.footer.aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-6 text-secondary">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-white/80 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/lawyers" className="text-white/80 hover:text-white text-sm transition-colors">
                  Our Lawyers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-6 text-secondary">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm whitespace-pre-wrap">
                  {content.siteSettings.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-white/80 text-sm">{content.siteSettings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-white/80 text-sm">{content.siteSettings.email}</span>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-6 text-secondary">Office Hours</h4>
            <ul className="space-y-4">
              <li className="flex justify-between text-sm text-white/80 border-b border-white/10 pb-2">
                <span>Monday - Friday</span>
                <span>{content.footer.officeHours.weekdays}</span>
              </li>
              <li className="flex justify-between text-sm text-white/80 border-b border-white/10 pb-2">
                <span>Saturday</span>
                <span>{content.footer.officeHours.saturday}</span>
              </li>
              <li className="flex justify-between text-sm text-white/80">
                <span>Sunday</span>
                <span>{content.footer.officeHours.sunday}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            &copy; {currentYear} {content.siteSettings.siteName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="text-white/60 hover:text-white text-sm transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
