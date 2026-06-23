import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    
    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    
    featuredImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=700&fit=crop",
    

    },
    
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["technology", "lifestyle", "business", "health", "travel", "food", "design", "development", "ux-design", "backend"],
    },
    
    tags: [{
      type: String,
      trim: true,
    }],
    
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    
    isFeatured: {
      type: Boolean,
      default: false,
    },
    
    views: {
      type: Number,
      default: 0,
    },
    
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      email: String,
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    
    metaTitle: {
      type: String,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
    },
    
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    
    keywords: [String],
    
    readingTime: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);