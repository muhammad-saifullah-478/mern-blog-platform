import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DeleteBlog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchPosts = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/posts?search=${searchQuery}`);
      if (response.data.success) {
        setSearchResults(response.data.posts);
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("Blog deleted successfully!");
        setSearchResults(searchResults.filter(post => post._id !== postId));
        if (searchResults.length === 1) {
          setSearchQuery("");
        }
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Blog Post</h1>
        <p className="text-gray-600 mb-4">Search for a blog to delete. This action cannot be undone.</p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a blog to delete..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={searchPosts}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Search Results:</h3>
              {searchResults.map(post => (
                <div key={post._id} className="border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-500">Category: {post.category}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id, post.title)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchQuery && !loading && searchResults.length === 0 && (
            <p className="text-gray-500 text-center py-4">No blogs found matching your search.</p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}