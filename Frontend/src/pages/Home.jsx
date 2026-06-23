import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, Clock, Loader, Sparkles, ArrowRight, Zap, BookOpen } from "lucide-react";
import BlogFooter from "../components/BlogFooter";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts?limit=9");
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        const featured = data.posts.find(post => post.isFeatured) || data.posts[0];
        setFeaturedPost(featured);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
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
    <div className="min-h-screen bg-gray-50">
 
      {/* <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated Background */}
        {/* <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div> */}
        
        {/* <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-bounce">
              <Sparkles size={18} className="text-yellow-300" />
              <span className="text-sm font-semibold">Welcome to BlogHub</span>
            </div> */}
            
            {/* Main Title */}
            {/* <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Stories & Insights
              </span>
            </h1> */}
            
            {/* Description */}
            {/* <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Join thousands of readers exploring technology, lifestyle, business, and more. 
              Get inspired with our daily curated content.
            </p> */}
            
            {/* CTA Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 duration-300"
              >
                <BookOpen size={20} />
                Start Reading
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition transform hover:scale-105 duration-300"
              >
                <Zap size={20} />
                Explore Categories
              </Link>
            </div> */}
            
            {/* Stats */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{posts.length}+</div>
                <div className="text-sm text-gray-200">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-200">Happy Readers</div>
              </div>
             
            </div> */}
          {/* </div>
        </div> */}
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#f3f4f6" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      {/* </div> */} 

      {/* Featured Post Hero with Image */}
      {featuredPost && (
        <div className="relative min-h-[500px] md:min-h-[600px] text-white ">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=800&fit=crop"}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 min-h-[500px] md:min-h-[600px] flex items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
                <span className="text-sm bg-black/50 px-3 py-1 rounded-full">
                  {featuredPost.category?.charAt(0).toUpperCase() + featuredPost.category?.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {featuredPost.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 mb-6 line-clamp-3">
                {featuredPost.excerpt || featuredPost.content?.substring(0, 150).replace(/<[^>]*>/g, "")}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={featuredPost.author?.profilePicture || "https://i.pravatar.cc/150"}
                    alt={featuredPost.author?.username}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span>{featuredPost.author?.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(featuredPost.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{featuredPost.readingTime || 5} min read</span>
                </div>
              </div>
              <Link
                to={`/post/${featuredPost.slug || featuredPost._id}`}
                className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 duration-300"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Articles</h2>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img
                src={post.featuredImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=350&fit=crop"}
                alt={post.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                    {post.category?.charAt(0).toUpperCase() + post.category?.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link to={`/post/${post.slug || post._id}`} className="hover:text-blue-600 transition">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {post.excerpt || post.content?.substring(0, 120).replace(/<[^>]*>/g, "")}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <img
                      src={post.author?.profilePicture || "https://i.pravatar.cc/150"}
                      alt={post.author?.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{post.author?.username}</span>
                  </div>
                  <Link
                    to={`/post/${post.slug || post._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found.</p>
          </div>
        )}
      </div>
     
      
    </div>
  );
}