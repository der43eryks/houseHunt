import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Browse Listings' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/help', label: 'Help & Support' },
];

const Footer = () => {
  const location = useLocation();
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">HouseHunt</h2>
            <p className="text-sm">
              Your trusted partner in finding the perfect student accommodation. We connect students with quality housing options near campus.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`hover:text-white transition-colors ${location.pathname === link.to ? 'text-blue-400 font-semibold' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-blue-500" />
                <span>Kakamega, Kenya</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-3 mt-1 text-blue-500" />
                <a href="mailto:info@househunt.com" className="hover:text-white transition-colors">info@househunt.com</a>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-3 mt-1 text-blue-500" />
                <a href="tel:+254712345678" className="hover:text-white transition-colors">+25483640875</a>
              </li>
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            {/* Social Icons can be added here */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} HouseHunt. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-gray-500">Privacy Policy</span>
            <span className="text-gray-500">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;