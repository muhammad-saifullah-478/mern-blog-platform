import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, XCircle, Send, Sparkles, Mail, Newspaper, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("EN");
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hello! 👋 I'm BlogHub AI Assistant. How can I help you today?" }
  ]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState("");
  const [newsletterError, setNewsletterError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (username && token) {
      setUser({ username });
      setUserRole(role);
    }

    const update = () => {
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("userRole");
      setUser(username ? { username } : null);
      setUserRole(role || null);
    };

    window.addEventListener("auth-change", update);
    return () => window.removeEventListener("auth-change", update);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setUser(null);
    setUserRole(null);
    navigate("/");
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
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage, chatHistory: [] }),
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

    setNewsletterError("");
    setNewsletterSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, name: user?.username || "" }),
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterSuccess(data.message);
        setNewsletterEmail("");
        setTimeout(() => {
          setShowNewsletterModal(false);
          setNewsletterSuccess("");
        }, 3000);
      } else {
        setNewsletterError(data.message);
      }
    } catch (error) {
      setNewsletterError("Failed to subscribe. Please try again.");
    }
  };

  const categories = ["React", "Node", "AI", "Web Dev", "Cyber Security"];

  // AI Modal Component
  const AIModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsAIModalOpen(false)}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">AI Assistant</h2>
              <p className="text-white/70 text-xs">Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearChat} className="text-white/70 hover:text-white transition text-xs px-2 py-1 rounded bg-white/10">Clear</button>
            <button onClick={() => setIsAIModalOpen(false)} className="text-white/70 hover:text-white transition"><XCircle size={18} /></button>
          </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-2.5 rounded-lg ${msg.role === "user" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"}`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Bot size={12} className="text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-b bg-gray-50">
          <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1"><Sparkles size={10} className="text-yellow-500" />Quick questions</p>
          <div className="flex flex-wrap gap-1.5">
            {["What's trending?", "Recommend articles", "Popular posts?", "How to start blogging?"].map((suggestion, idx) => (
              <button key={idx} onClick={() => setAiMessage(suggestion)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full transition">
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAIChat} className="p-4 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input type="text" value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} placeholder="Ask me anything..." className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <button type="submit" disabled={isAiLoading || !aiMessage.trim()} className="bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 text-white">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Newsletter Modal
  const NewsletterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowNewsletterModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Subscribe to Newsletter</h2>
            <p className="text-gray-600 mt-2">Get the latest posts and updates directly in your inbox!</p>
          </div>

          {newsletterSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm">
              {newsletterSuccess}
            </div>
          )}

          {newsletterError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center text-sm">
              {newsletterError}
            </div>
          )}

          <form onSubmit={handleNewsletterSubscribe}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              Subscribe Now
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className={`${dark ? "bg-gray-900" : "bg-black"} text-white px-4 py-3 flex items-center justify-between transition-all duration-300`}>

        {/* Logo */}
        <h1 onClick={() => navigate("/")} className="text-xl font-bold cursor-pointer hover:text-blue-400 transition">
          MyWebsite
        </h1>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-5 text-sm">

          <button onClick={() => navigate("/")} className="hover:text-blue-400">Home</button>
          <button onClick={() => navigate("/categories")} className="hover:text-blue-400">Categories</button>
          <button onClick={() => navigate("/news")} className="hover:text-blue-400">News</button>
          <button onClick={() => navigate("/tech")} className="hover:text-blue-400">Tech</button>
          
          {/* Contact Button */}
          <button onClick={() => navigate("/contact")} className="flex items-center gap-1 hover:text-green-400 transition">
            <MessageCircle size={14} />
            Contact
          </button>
          
          {/* Newsletter Button */}
          <button onClick={() => setShowNewsletterModal(true)} className="flex items-center gap-1 hover:text-yellow-400 transition">
            <Newspaper size={14} />
            Newsletter
          </button>
          
          <button onClick={() => navigate("/about")} className="hover:text-blue-400">About</button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button onClick={() => setOpenCat(!openCat)} className="hover:text-blue-400">
              Tags ▼
            </button>
            {openCat && (
              <div className="absolute top-6 left-0 bg-white text-black rounded shadow-lg w-40 animate-fade">
                {categories.map((c, i) => (
                  <div key={i} onClick={() => { navigate(`/tags/${c.toLowerCase()}`); setOpenCat(false); }} className="px-3 py-2 hover:bg-gray-200 cursor-pointer">
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <input type="text" placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") navigate(`/search?q=${search}`); }} className="px-2 py-1 rounded text-black" />

          {/* AI Assistant Button */}
          <button onClick={() => setIsAIModalOpen(true)} className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 text-sm">
            <Bot size={14} />
            <span className="font-semibold">AI</span>
          </button>

          {/* Language Switch */}
          <button onClick={() => setLang(lang === "EN" ? "UR" : "EN")} className="hover:text-yellow-400">{lang}</button>

          {/* Dark Mode */}
          <button onClick={() => setDark(!dark)} className="hover:text-yellow-400">{dark ? "☀️" : "🌙"}</button>

        </div>

        {/* Dashboard Link - Only show for admin users */}
        {userRole === "admin" && (
          <Link to='/dashboard' className="hover:text-blue-400 ml-4">Dashboard</Link>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm bg-gray-700 px-2 py-1 rounded">{user.username}</span>
              <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="hover:text-blue-400">Login</button>
              <button onClick={() => navigate("/signup")} className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">Signup</button>
            </>
          )}
        </div>

      </nav>

      {/* Modals */}
      {isAIModalOpen && <AIModal />}
      {showNewsletterModal && <NewsletterModal />}
    </>
  );
}