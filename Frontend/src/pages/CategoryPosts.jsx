import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader } from "lucide-react";

export default function CategoryPosts() {  // Make sure this is exported
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryPosts();
  }, [category]);

  const fetchCategoryPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/posts/category/${category}`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching category posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">
          {category?.charAt(0).toUpperCase() + category?.slice(1)}
        </h1>
        <p className="text-gray-600 mb-6">Found {posts.length} posts in this category</p>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No posts found in this category.</p>
            <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Go back home
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <article key={post._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                <Link to={`/post/${post.slug || post._id}`} className="flex flex-col md:flex-row">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full md:w-48 h-48 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-blue-600 font-semibold">
                        {post.category?.charAt(0).toUpperCase() + post.category?.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
                    <p className="text-gray-600 line-clamp-2">
                      {post.excerpt || post.content?.substring(0, 120).replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}