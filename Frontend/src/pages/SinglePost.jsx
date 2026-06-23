import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, User, Clock, Heart, MessageCircle, Share2, ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await response.json();

      if (data.success) {
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
        setLikesCount(data.post.likes?.length || 0);
        if (user && data.post.likes?.includes(user.id)) {
          setLiked(true);
        }
        setComments(data.post.comments || []);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setLiked(data.isLiked);
        setLikesCount(data.likes);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });
      const data = await response.json();

      if (data.success) {
        setComments([data.comment, ...comments]);
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmitting(false);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Post not found</p>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="bg-gray-200 px-3 py-1 rounded-full">
                {post.category?.charAt(0).toUpperCase() + post.category?.slice(1)}
              </span>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime || 5} min read
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 pt-4 border-t border-b py-4">
              <img
                src={post.author?.profilePicture || "https://i.pravatar.cc/150"}
                alt={post.author?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{post.author?.username}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement Buttons */}
          <div className="flex items-center gap-6 pt-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${liked ? "text-red-600" : "text-gray-600 hover:text-red-600"}`}
            >
              <Heart size={24} fill={liked ? "currentColor" : "none"} />
              <span>{likesCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle size={24} />
              <span>{comments.length}</span>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg text-center mb-8">
              <p className="text-gray-600">
                <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={comment.user?.profilePicture || "https://i.pravatar.cc/150"}
                    alt={comment.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{comment.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <div
                  key={relatedPost._id}
                  onClick={() => navigate(`/post/${relatedPost.slug || relatedPost._id}`)}
                  className="cursor-pointer group bg-white rounded-lg shadow overflow-hidden"
                >
                  <img
                    src={relatedPost.featuredImage}
                    alt={relatedPost.title}
                    className="w-full h-40 object-cover group-hover:opacity-90 transition"
                  />
                  <div className="p-3">
                    <h4 className="font-semibold group-hover:text-blue-600 transition line-clamp-2">
                      {relatedPost.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}