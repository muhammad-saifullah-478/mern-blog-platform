import { useState, useEffect } from "react";
import { Send, Users, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminNewsletter() {
  const { isAdmin } = useAuth();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/newsletter/subscribers");
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.subscribers);
        setSubscriberCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!subject || !content) {
      setError("Please fill in both subject and content");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Newsletter sent! Sent to ${data.sentCount} subscribers. Failed: ${data.failedCount}`);
        setSubject("");
        setContent("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to send newsletter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Newsletter Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-600" size={20} />
                    <span>Total Subscribers</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{subscriberCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="text-green-600" size={20} />
                    <span>Campaigns Sent</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">0</span>
                </div>
              </div>

              {subscribers.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Recent Subscribers</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {subscribers.slice(-5).reverse().map((sub, idx) => (
                      <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                        <p className="font-medium">{sub.name || "Anonymous"}</p>
                        <p className="text-gray-500 text-xs">{sub.email}</p>
                        <p className="text-gray-400 text-xs">{new Date(sub.subscribedAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Send Newsletter Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Send Newsletter</h2>

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                  <CheckCircle size={20} />
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSendNewsletter} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Newsletter subject..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows="10"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your newsletter content here... (HTML supported)"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    Will be sent to <strong>{subscriberCount}</strong> subscribers
                  </div>
                  <button
                    type="submit"
                    disabled={loading || subscriberCount === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? "Sending..." : "Send Newsletter"}
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}