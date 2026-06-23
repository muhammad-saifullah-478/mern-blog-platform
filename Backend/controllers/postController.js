import Post from "../models/Post.js";

// ---------------- HELPERS ----------------

const generateSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const calculateReadingTime = (content) => {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
};

// ---------------- GET ALL POSTS ----------------

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search, featured } = req.query;

    const query = { status: "published" };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (featured === "true") query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .populate("author", "username email profilePicture bio")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- GET SINGLE POST ----------------

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { slug: id };

    query.status = "published";

    const post = await Post.findOne(query)
      .populate("author", "username email profilePicture bio");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    post.views += 1;
    await post.save();

    const relatedPosts = await Post.find({
      category: post.category,
      _id: { $ne: post._id },
      status: "published",
    }).limit(3);

    res.json({ success: true, post, relatedPosts });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- CREATE POST ----------------

export const createPost = async (req, res) => {
  try {
    if (!req.user || req.user.role?.toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create posts",
      });
    }

    const { title, content, category, tags, status, isFeatured, excerpt } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content, category required",
      });
    }

    const post = await Post.create({
      title,
      slug: generateSlug(title),
      content,
      excerpt: excerpt || content.substring(0, 200),
      category,
      tags: tags
        ? typeof tags === "string"
          ? tags.split(",").map(t => t.trim())
          : tags
        : [],
      author: req.user.id,
      featuredImage: req.file ? req.file.path : "",
      status: status || "published",
      isFeatured: isFeatured === "true" || isFeatured === true,
      readingTime: calculateReadingTime(content),
    });

    res.status(201).json({ success: true, post });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- UPDATE POST ----------------

export const updatePost = async (req, res) => {
  try {
    if (!req.user || req.user.role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins" });
    }

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, post: updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE POST ----------------

export const deletePost = async (req, res) => {
  try {
    if (!req.user || req.user.role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- ADD COMMENT (FIXED) ----------------

export const addComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user.id,
      name: req.user.username,
      content: req.body.content,
    });

    await post.save();

    res.json({
      success: true,
      comments: post.comments,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET COMMENTS (FIXED) ----------------

export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .select("comments")
      .populate("comments.user", "username profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ success: true, comments: post.comments });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};