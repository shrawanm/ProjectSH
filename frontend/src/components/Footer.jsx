import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
export function Footer() {
  return <footer className="bg-bg-darker dark:bg-bg-darker text-text-primary pt-16 pb-8 relative overflow-hidden">
      {/* Mountain SVG Pattern */}
      <div className="absolute top-0 left-0 w-full h-24 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="currentColor">
          <path d="M0,120 L0,60 L120,40 L240,70 L360,30 L480,60 L600,20 L720,50 L840,10 L960,45 L1080,25 L1200,55 L1320,35 L1440,65 L1440,120 Z" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold">
              Shrawan<span className="text-accent">Handicrafts</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Bringing the timeless heritage of Nepali craftsmanship to the modern world. Every piece tells a story of tradition, skill, and Himalayan spirit.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>)}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-accent">Shop</h3>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link to="/collections" className="hover:text-accent transition-colors">All Collections</Link></li>
              <li><Link to="/pashmina" className="hover:text-accent transition-colors">Pashmina & Cashmere</Link></li>
              <li><Link to="/crafts" className="hover:text-accent transition-colors">Statues & Crafts</Link></li>
              <li><Link to="/yak-wool" className="hover:text-accent transition-colors">Yak Wool Products</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-accent">Support</h3>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-accent">Contact</h3>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>Thamel, Kathmandu 44600,<br />Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+977 1-4423567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>hello@shrawanhandicrafts.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Shrawan Handicrafts. All rights reserved.
          </p>
          <div className="flex gap-4 items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>;
}