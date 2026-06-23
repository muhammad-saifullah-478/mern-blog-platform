import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Search, Menu, X, TrendingUp, Flame, Home, BookOpen, 
  User, LogOut, Bot, Send, XCircle, Sparkles, MessageCircle, 
  Newspaper, Mail, MapPin, Phone, CheckCircle, AlertCircle
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hello! 👋 I'm BlogHub AI Assistant. How can I help you today?" }
  ]);
  
  // Newsletter Modal States
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState("");
  const [newsletterError, setNewsletterError] = useState("");

  const navigate = useNavigate();

  // Fetch trending and popular posts
  useEffect(() => {
    fetchTrendingAndPopular();
  }, []);

  const fetchTrendingAndPopular = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts?limit=10");
      const data = await response.json();
      if (data.success) {
        const trending = [...data.posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
        const popular = [...data.posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 5);
        setTrendingPosts(trending);
        setPopularPosts(popular);
      }
    } catch (error) {
      console.error("Error fetching trending posts:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleAIChat = async (e) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userMessage = { role: "user", content: aiMessage };
    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = aiMessage;
    setAiMessage("");
    setIsAiLoading(true);

    try {
      const apiChatHistory = chatHistory.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }));

      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage, chatHistory: apiChatHistory }),
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again!" }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setChatHistory(prev => [...prev, { role: "assistant", content: "Network error. Please check your connection!" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([
      { role: "assistant", content: "Hello! 👋 I'm BlogHub AI Assistant. How can I help you today?" }
    ]);
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterLoading(true);
    setNewsletterError("");
    setNewsletterSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: newsletterEmail, 
          name: newsletterName || user?.username || "Subscriber" 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterSuccess(data.message);
        setNewsletterEmail("");
        setNewsletterName("");
        setTimeout(() => {
          setIsNewsletterModalOpen(false);
          setNewsletterSuccess("");
        }, 3000);
      } else {
        setNewsletterError(data.message);
      }
    } catch (error) {
      setNewsletterError("Failed to subscribe. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const categories = [
    "technology", "lifestyle", "business", "health",
    "travel", "food", "design",
  ];

  // AI Modal Component
  const AIModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsAIModalOpen(false)}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">AI Assistant</h2>
              <p className="text-white/70 text-xs">Powered by Groq</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearChat} className="text-white/70 hover:text-white transition text-xs px-2 py-1 rounded bg-white/10">Clear</button>
            <button onClick={() => setIsAIModalOpen(false)} className="text-white/70 hover:text-white transition"><XCircle size={18} /></button>
          </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
              <div className={`max-w-[85%] p-2.5 rounded-lg ${msg.role === "user" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700"}`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Bot size={12} className="text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1"><Sparkles size={10} className="text-yellow-500" />Quick questions</p>
          <div className="flex flex-wrap gap-1.5">
            {["What's trending?", "Recommend tech articles", "Popular posts?", "How to start blogging?"].map((suggestion, idx) => (
              <button key={idx} onClick={() => setAiMessage(suggestion)} className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full transition">
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAIChat} className="p-4 bg-white dark:bg-gray-800 rounded-b-2xl">
          <div className="flex gap-2">
            <input type="text" value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} placeholder="Ask me anything..." className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <button type="submit" disabled={isAiLoading || !aiMessage.trim()} className="bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 text-white">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Newsletter Modal Component
  const NewsletterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsNewsletterModalOpen(false)}>
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <button onClick={() => setIsNewsletterModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition">
            <XCircle size={20} />
          </button>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Subscribe to Newsletter</h2>
              <p className="text-gray-600 mt-2">Get the latest posts and updates directly in your inbox!</p>
            </div>

            {newsletterSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
                <CheckCircle size={16} /> {newsletterSuccess}
              </div>
            )}

            {newsletterError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} /> {newsletterError}
              </div>
            )}

            <form onSubmit={handleNewsletterSubscribe}>
              <input
                type="text"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
              />
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address *"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                {newsletterLoading ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 to-black text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-blue-400 hover:to-purple-400 transition">
              BlogHub
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-5">
              <Link to="/" className="flex items-center gap-1 text-sm hover:text-blue-400 transition">
                <Home size={15} />
                Home
              </Link>
              
              {/* Trending Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm hover:text-yellow-400 transition">
                  <TrendingUp size={15} />
                  Trending
                </button>
                <div className="absolute top-full left-0 mt-2 w-60 bg-white text-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <h3 className="font-bold text-xs px-3 py-2 text-gray-700 border-b">Hot Topics 🔥</h3>
                    {trendingPosts.length > 0 ? (
                      trendingPosts.map((post, index) => (
                        <Link key={post._id} to={`/post/${post.slug || post._id}`} className="block px-3 py-2 hover:bg-gray-100 rounded-lg transition">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 font-bold text-xs">#{index + 1}</span>
                            <span className="text-xs font-medium">{post.title.substring(0, 35)}...</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{post.views || 0} views</div>
                        </Link>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-xs text-gray-500">No trending posts</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Popular Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm hover:text-red-400 transition">
                  <Flame size={15} />
                  Popular
                </button>
                <div className="absolute top-full left-0 mt-2 w-60 bg-white text-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <h3 className="font-bold text-xs px-3 py-2 text-gray-700 border-b">Most Liked ❤️</h3>
                    {popularPosts.length > 0 ? (
                      popularPosts.map((post, index) => (
                        <Link key={post._id} to={`/post/${post.slug || post._id}`} className="block px-3 py-2 hover:bg-gray-100 rounded-lg transition">
                          <div className="flex items-center gap-2">
                            <span className="text-red-500 font-bold text-xs">#{index + 1}</span>
                            <span className="text-xs font-medium">{post.title.substring(0, 35)}...</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{post.likes?.length || 0} likes</div>
                        </Link>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-xs text-gray-500">No popular posts</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm hover:text-green-400 transition">
                  <BookOpen size={15} />
                  Categories
                </button>
                <div className="absolute top-full left-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {categories.map((cat) => (
                    <Link key={cat} to={`/category/${cat}`} className="block px-3 py-1.5 text-xs hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg capitalize">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <Link to="/contact" className="flex items-center gap-1 text-sm hover:text-green-400 transition">
                <MessageCircle size={15} />
                Contact
              </Link>

              {/* Newsletter Button */}
              <button onClick={() => setIsNewsletterModalOpen(true)} className="flex items-center gap-1 text-sm hover:text-yellow-400 transition">
                <Newspaper size={15} />
                Newsletter
              </button>

              {isAdmin && (
                <Link to="/dashboard" className="flex items-center gap-1 text-sm hover:text-purple-400 transition">
                  <User size={15} />
                  Dashboard
                </Link>
              )}

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex">
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="px-3 py-1.5 text-sm rounded-l-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 lg:w-48" />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
                <button type="submit" className="bg-blue-600 px-3 py-1.5 text-sm rounded-r-lg hover:bg-blue-700 transition">Go</button>
              </form>

              {/* AI Assistant Button */}
              <button onClick={() => setIsAIModalOpen(true)} className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 text-sm">
                <Bot size={14} />
                <span className="font-semibold">AI</span>
              </button>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">👋 {user.username}</span>
                  <button onClick={logout} className="flex items-center gap-1 bg-red-600 px-2 py-1 text-sm rounded-lg hover:bg-red-700 transition">
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="px-3 py-1.5 text-sm rounded-lg border border-white hover:bg-white hover:text-black transition">Login</Link>
                  <Link to="/signup" className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition">Signup</Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-800 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col space-y-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm">🏠 Home</Link>
                
                <div className="py-1">
                  <h3 className="font-bold text-yellow-400 text-xs mb-1">🔥 Trending</h3>
                  <div className="pl-3 space-y-1">
                    {trendingPosts.slice(0, 3).map((post) => (
                      <Link key={post._id} to={`/post/${post.slug || post._id}`} onClick={() => setMobileMenuOpen(false)} className="block text-xs text-gray-300 hover:text-white py-1">
                        • {post.title.substring(0, 45)}...
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <h3 className="font-bold text-red-400 text-xs mb-1">❤️ Popular</h3>
                  <div className="pl-3 space-y-1">
                    {popularPosts.slice(0, 3).map((post) => (
                      <Link key={post._id} to={`/post/${post.slug || post._id}`} onClick={() => setMobileMenuOpen(false)} className="block text-xs text-gray-300 hover:text-white py-1">
                        • {post.title.substring(0, 45)}...
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <h3 className="font-bold text-green-400 text-xs mb-1">📚 Categories</h3>
                  <div className="pl-3 space-y-1">
                    {categories.map((cat) => (
                      <Link key={cat} to={`/category/${cat}`} onClick={() => setMobileMenuOpen(false)} className="block text-xs text-gray-300 hover:text-white capitalize py-1">
                        • {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm text-green-400">
                  <MessageCircle size={16} /> Contact
                </Link>

                <button onClick={() => { setIsNewsletterModalOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 py-2 text-sm text-yellow-400">
                  <Newspaper size={16} /> Newsletter
                </button>

                {isAdmin && (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm">👤 Dashboard</Link>
                )}

                <button onClick={() => { setIsAIModalOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 rounded-lg text-center justify-center text-sm">
                  <Bot size={16} /> AI Assistant
                </button>

                <form onSubmit={handleSearch} className="flex pt-2">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-1.5 text-sm rounded-l-lg text-black" />
                  <button type="submit" className="bg-blue-600 px-3 py-1.5 text-sm rounded-r-lg">Search</button>
                </form>

                {user ? (
                  <>
                    <div className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg">👋 Logged in: {user.username}</div>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="bg-red-600 px-3 py-1.5 text-sm rounded-lg text-center">Logout</button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 border border-white px-3 py-1.5 text-sm rounded-lg text-center">Login</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 bg-blue-600 px-3 py-1.5 text-sm rounded-lg text-center">Signup</Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      {isAIModalOpen && <AIModal />}
      {isNewsletterModalOpen && <NewsletterModal />}
    </>
  );
}