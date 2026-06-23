export const isAdmin = (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin rights required.",
      });
    }
    
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user is author or admin
export const isAuthorOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role === "admin" || req.user.id === req.params.userId || req.user.id === req.body.author) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Access denied. You can only modify your own posts.",
      });
    }
  } catch (error) {
    console.error("Author or admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};