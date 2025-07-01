import Link from "next/link"
import { Palette, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold gradient-text">Future Gallery</span>
            </div>
            <p className="text-slate-400 text-sm">
              Redefining the art experience through digital innovation and immersive exhibitions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {["Exhibitions", "Artists", "Tickets", "About"].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Support</h3>
            <div className="space-y-2">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@futuregallery.com</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Digital Realm, Metaverse</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Future Gallery. All rights reserved. Crafted with ❤️ for art lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}
