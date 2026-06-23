import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Store subscribers (in production, use a database)
let subscribers = [];

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if already subscribed
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: "Email already subscribed!",
      });
    }

    // Add subscriber
    subscribers.push({
      email,
      name: name || "Subscriber",
      subscribedAt: new Date(),
    });

    // Send welcome email
    const welcomeOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to BlogHub Newsletter! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to BlogHub!</h2>
          <p>Dear ${name || "Reader"},</p>
          <p>Thank you for subscribing to our newsletter! You'll now receive the latest blog posts, updates, and exclusive content directly in your inbox.</p>
          <p>What to expect:</p>
          <ul>
            <li>Weekly blog highlights</li>
            <li>Exclusive tips and tricks</li>
            <li>Community updates</li>
            <li>Special offers and events</li>
          </ul>
          <p>Stay tuned for amazing content!</p>
          <p>Best regards,<br><strong>BlogHub Team</strong></p>
          <hr>
          <p style="font-size: 12px; color: #666;">You can unsubscribe anytime by clicking <a href="#">here</a>.</p>
        </div>
      `,
    };

    await transporter.sendMail(welcomeOptions);

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      subscribersCount: subscribers.length,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again.",
    });
  }
});

// Send newsletter to all subscribers (Admin only)
router.post("/send", async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Subject and content are required",
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send email to all subscribers
    for (const subscriber of subscribers) {
      try {
        const newsletterOptions = {
          from: process.env.EMAIL_USER,
          to: subscriber.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">BlogHub Newsletter</h2>
              <p>Dear ${subscriber.name},</p>
              <div>${content}</div>
              <hr>
              <p style="font-size: 12px; color: #666;">You received this email because you subscribed to BlogHub newsletter.</p>
            </div>
          `,
        };

        await transporter.sendMail(newsletterOptions);
        sentCount++;
      } catch (error) {
        failedCount++;
        console.error(`Failed to send to ${subscriber.email}:`, error);
      }
    }

    res.status(200).json({
      success: true,
      message: `Newsletter sent! Sent: ${sentCount}, Failed: ${failedCount}`,
      sentCount,
      failedCount,
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get subscriber count
router.get("/subscribers", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Unsubscribe from newsletter
router.post("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;

    const initialLength = subscribers.length;
    subscribers = subscribers.filter(sub => sub.email !== email);

    if (subscribers.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Email not found in subscribers list",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;