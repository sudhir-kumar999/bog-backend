const express = require('express');
const BlogPost = require('../models/BlogPost.cjs');
const slugify = require('slugify');

const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    console.log('Backend sending posts:', posts);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Temporary debug route to list all slugs
router.get('/debug-slugs', async (req, res) => {
  try {
    const posts = await BlogPost.find({}, 'title slug'); // Fetch only title and slug
    res.json(posts);
  } catch (err) {
    console.error('Error fetching slugs for debug:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get a single blog post by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    console.log(`Backend received request for identifier: ${req.params.identifier}`);
    let post = await BlogPost.findOne({ slug: new RegExp(`^${req.params.identifier}$`, 'i') });
    console.log('Post found by slug:', post ? post.title : 'None');

    if (!post) {
      // For debugging: if not found by slug, log all existing slugs
      const allSlugs = await BlogPost.find({}, 'slug title');
      console.log('DEBUG: All slugs in DB:', allSlugs.map(p => ({ title: p.title, slug: p.slug })));

      // If not found by slug, and it looks like a valid MongoDB ObjectId, try by ID
      if (req.params.identifier.match(/^[0-9a-fA-F]{24}$/)) {
        post = await BlogPost.findById(req.params.identifier);
        console.log('Post found by ID:', post ? post.title : 'None');
      }
    }

    if (!post) {
      console.log(`Post not found for identifier: ${req.params.identifier}`);
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error('Backend error fetching post:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create a new blog post
router.post('/', async (req, res) => {
  const post = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    excerpt: req.body.excerpt,
    author: req.body.author,
    publishedDate: req.body.publishedDate,
    readTime: req.body.readTime,
    tags: req.body.tags,
    imageUrl: req.body.imageUrl,
    slug: slugify(req.body.title, { lower: true, strict: true }),
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (req.body.title != null) {
      post.title = req.body.title;
      post.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    if (req.body.content != null) {
      post.content = req.body.content;
    }
    if (req.body.excerpt != null) {
      post.excerpt = req.body.excerpt;
    }
    if (req.body.author != null) {
      post.author = req.body.author;
    }
    if (req.body.publishedDate != null) {
      post.publishedDate = req.body.publishedDate;
    }
    if (req.body.readTime != null) {
      post.readTime = req.body.readTime;
    }
    if (req.body.tags != null) {
      post.tags = req.body.tags;
    }
    if (req.body.imageUrl != null) {
      post.imageUrl = req.body.imageUrl;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 