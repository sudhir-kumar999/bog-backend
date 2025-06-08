const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: String,
  author: {
    name: String,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  readTime: Number,
  tags: [String],
  imageUrl: String,
  slug: {
    type: String,
    unique: true,
  },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema, 'blogposts');

module.exports = BlogPost; 