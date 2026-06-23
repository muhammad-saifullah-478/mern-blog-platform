// components/FristHome.jsx
import React, { useState, useEffect } from 'react';
import { Clock, User, Calendar, TrendingUp, Bookmark, Share2, Loader } from 'lucide-react';
import BlogFooter from '../page/BlogFooter';
import { Link } from 'react-router-dom';

export const FristHome = () => {
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [sidePosts, setSidePosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/posts?limit=10');
      const data = await response.json();

      if (data.success) {
        const posts = data.posts;
        
        // Find featured post (first or isFeatured true)
        const featured = posts.find(post => post.isFeatured === true) || posts[0];
        setFeaturedPost(featured);
        
        // Set side posts (next 2 posts after featured)
        const remainingPosts = posts.filter(post => post._id !== featured?._id);
        setSidePosts(remainingPosts.slice(0, 2));
        
        // Set recent posts (next 3 posts)
        setRecentPosts(remainingPosts.slice(2, 5));
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatReadTime = (minutes) => {
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPosts}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Featured Post */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Featured Article */}
          {featuredPost && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-12 lg:mb-16">
              <div className="lg:col-span-3">
                <Link to={`/post/${featuredPost.slug || featuredPost._id}`}>
                  <div className="relative group cursor-pointer">
                    <div className="relative h-64 sm:h-80 lg:h-[482px] rounded-xl lg:rounded-2xl overflow-hidden shadow-xl">
                      <img 
                        src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=700&fit=crop"}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
                        <span className="inline-flex items-center bg-white text-black px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold">
                          <TrendingUp size={14} className="mr-1 lg:mr-2" />
                          Featured
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
                        <div className="flex items-center flex-wrap gap-2 mb-2 lg:mb-3">
                          <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-semibold">
                            {featuredPost.category?.charAt(0).toUpperCase() + featuredPost.category?.slice(1)}
                          </span>
                          {featuredPost.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-xs text-gray-300">#{tag}</span>
                          ))}
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 leading-tight">
                          {featuredPost.title}
                        </h1>
                        <p className="text-gray-200 text-sm sm:text-base lg:text-lg mb-3 lg:mb-4 line-clamp-2">
                          {featuredPost.excerpt || featuredPost.content?.substring(0, 150).replace(/<[^>]*>/g, "")}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <img 
                              src={featuredPost.author?.profilePicture || "https://i.pravatar.cc/150"}
                              alt={featuredPost.author?.username}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white"
                            />
                            <div>
                              <p className="font-semibold text-xs lg:text-sm">{featuredPost.author?.username}</p>
                              <div className="flex items-center space-x-2 lg:space-x-3 text-xs text-gray-300">
                                <span className="hidden sm:inline">{formatDate(featuredPost.createdAt)}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{formatReadTime(featuredPost.readingTime || 5)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Side Posts */}
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                {sidePosts.map(post => (
                  <Link key={post._id} to={`/post/${post.slug || post._id}`}>
                    <article className="group cursor-pointer bg-white rounded-lg lg:rounded-xl border border-gray-100 hover:border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <div className="flex h-full">
                        <div className="w-2/5 sm:w-1/3 lg:w-2/5 relative overflow-hidden">
                          <img 
                            src={post.featuredImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="w-3/5 sm:w-2/3 lg:w-3/5 p-3 sm:p-4 lg:p-5 flex flex-col justify-between">
                          <div>
                            <span className="inline-block text-xs font-bold text-gray-900 mb-1.5 lg:mb-2 uppercase tracking-wide">
                              {post.category?.charAt(0).toUpperCase() + post.category?.slice(1)}
                            </span>
                            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-1.5 lg:mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 lg:mb-3 hidden sm:block">
                              {post.excerpt || post.content?.substring(0, 100).replace(/<[^>]*>/g, "")}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1.5 lg:space-x-2 text-xs text-gray-500">
                            <img 
                              src={post.author?.profilePicture || "https://i.pravatar.cc/150"}
                              alt={post.author?.username}
                              className="w-5 h-5 lg:w-6 lg:h-6 rounded-full"
                            />
                            <span className="font-medium truncate">{post.author?.username}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{formatReadTime(post.readingTime || 5)}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest Posts Section */}
          {recentPosts.length > 0 && (
            <div className="border-t border-gray-200 pt-8 lg:pt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Latest Articles</h2>
                <div className="flex items-center space-x-2 lg:space-x-3 text-xs sm:text-sm overflow-x-auto">
                  <button className="text-gray-600 hover:text-black font-medium transition-colors whitespace-nowrap">
                    All Posts
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-gray-600 hover:text-black font-medium transition-colors whitespace-nowrap">
                    Popular
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-gray-600 hover:text-black font-medium transition-colors whitespace-nowrap">
                    Trending
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {recentPosts.map(post => (
                  <Link key={post._id} to={`/post/${post.slug || post._id}`}>
                    <article className="group cursor-pointer">
                      <div className="relative h-48 sm:h-56 lg:h-64 rounded-lg lg:rounded-xl overflow-hidden mb-4 lg:mb-5 shadow-md">
                        <img 
                          src={post.featuredImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=350&fit=crop"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 lg:top-4 lg:right-4 flex space-x-2">
                          <button className="bg-white/90 backdrop-blur-sm p-1.5 lg:p-2 rounded-full hover:bg-white transition-colors">
                            <Bookmark size={14} className="lg:w-4 lg:h-4" />
                          </button>
                          <button className="bg-white/90 backdrop-blur-sm p-1.5 lg:p-2 rounded-full hover:bg-white transition-colors">
                            <Share2 size={14} className="lg:w-4 lg:h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 lg:space-y-3">
                        <span className="inline-block text-xs font-bold text-gray-900 uppercase tracking-wide">
                          {post.category?.charAt(0).toUpperCase() + post.category?.slice(1)}
                        </span>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm lg:text-base text-gray-600 leading-relaxed line-clamp-2">
                          {post.excerpt || post.content?.substring(0, 120).replace(/<[^>]*>/g, "")}
                        </p>
                        <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <img 
                              src={post.author?.profilePicture || "https://i.pravatar.cc/150"}
                              alt={post.author?.username}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
                            />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">{post.author?.username}</p>
                              <p className="text-xs text-gray-500 hidden sm:block">{formatDate(post.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                            <Clock size={14} className="lg:w-4 lg:h-4" />
                            <span>{formatReadTime(post.readingTime || 5)}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-8 lg:mt-12">
            <button 
              onClick={() => window.location.href = '/blog'}
              className="inline-flex items-center justify-center bg-black text-white px-6 py-2.5 lg:px-8 lg:py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold text-sm lg:text-base w-full sm:w-auto"
            >
              Load More Articles
            </button>
          </div>
        </div>
      </div>
      <BlogFooter/>
    </div>
  );
};