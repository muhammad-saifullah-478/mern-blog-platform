import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Heart, Send, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function BlogFooter() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Add your newsletter subscription API call here
      console.log("Subscribed with email:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              BlogHub
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Your go-to source for amazing content, insights, and stories. 
              Join our community of readers and writers sharing knowledge every day.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition-all duration-300 transform hover:scale-110"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 mt-1"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Blog
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Categories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Categories
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 mt-1"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/category/technology" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Technology
                </Link>
              </li>
              <li>
                <Link to="/category/lifestyle" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/category/business" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Business
                </Link>
              </li>
              <li>
                <Link to="/category/health" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Health & Wellness
                </Link>
              </li>
              <li>
                <Link to="/category/travel" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Travel
                </Link>
              </li>
              <li>
                <Link to="/category/food" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-blue-500">›</span> Food
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500 mt-1"></span>
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">123 Blog Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <a href="mailto:info@bloghub.com" className="text-sm hover:text-white transition-colors">
                  info@bloghub.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-sm hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-3">
                Subscribe to our newsletter for weekly updates!
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors duration-300"
                >
                  <Send size={18} />
                </button>
              </form>
              {subscribed && (
                <p className="text-green-500 text-sm mt-2 animate-pulse">
                  ✓ Subscribed successfully!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} BlogHub. All rights reserved.
            </p>
            
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-current animate-pulse" />
              <span>by BlogHub Team</span>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}