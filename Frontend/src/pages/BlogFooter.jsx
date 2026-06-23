import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function BlogFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MyWebsite</h3>
            <p className="text-gray-400 mb-4">
              Your go-to source for amazing content, insights, and stories. Join our community today!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-400 transition-colors transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors transform hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors transform hover:scale-110">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors transform hover:scale-110">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Technology</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Tech News & Updates</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cybersecurity</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Apps</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Health AI</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>123 Blog Street, City, Country</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={20} className="flex-shrink-0" />
                <a href="mailto:info@mywebsite.com" className="hover:text-white transition-colors">
                  info@mywebsite.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone size={20} className="flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
       
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} MyWebsite. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-current" />
              <span>by Your Team</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}